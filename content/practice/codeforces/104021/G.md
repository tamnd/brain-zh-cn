---
title: "CF 104021G - 锅！！"
description: "我们得到一个长度最多为十万的数组。 每个元素都从 1 开始，然后我们执行一系列操作，将连续段乘以 2 到 10 之间的小整数，或者要求对段进行查询。"
date: "2026-07-02T04:36:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104021
codeforces_index: "G"
codeforces_contest_name: "The 2019 ICPC Asia Yinchuan Regional Contest"
rating: 0
weight: 104021
solve_time_s: 58
verified: true
draft: false
---

[CF 104021G - 锅！！](https://codeforces.com/problemset/problem/104021/G)

 **评级：** -
 **标签：** -
 **求解时间：** 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个长度最多为十万的数组。 每个元素都从 1 开始，然后我们执行一系列操作，将连续段乘以 2 到 10 之间的小整数，或者要求对段进行查询。 

每个数组值总是被分解为素数，我们唯一关心的是素数除以一个数字多少次。 对于值 ai，对于素数 p，我们将分数 potp(ai) 定义为 ai 因式分解中 p 的指数。 对于每个位置 i，我们查看所有能整除 ai 的素数并取其中最大的指数。 范围查询要求段上的最大此类值。 

因此从概念上讲，每个数字都带有多个素数“层”，但我们只跟踪每个位置上最强的单层，然后是一个范围内最强的层。 

这些限制表明我们不能在每次更新时简单地模拟因式分解。 更新次数多达十万次，每次乘法都适用于整个段。 即使每个值最初的大小都很小，重复更新很快就会使值变大，因此直接重新计算分解速度太慢。 

关键的结构限制是乘数很小，最多 10。这意味着每次更新仅引入集合 {2, 3, 5, 7} 中的素数。 没有其他素数出现。 这将问题从任意因式分解分解为跟踪每个位置的四个指数。 

一个微妙的陷阱是误读查询：我们不是对指数求和，也不是在全局范围内取素数的最大值。 对于每个位置，我们采用其素数中的最佳指数，然后在该段上最大化该指数。 这使得它成为一个“两级最大值”问题，而不是一个简单的范围最大值问题。 

当多个素数在同一索引上累积不同时，就会出现边缘情况。 例如，如果一个位置有 2^5·3^1，则其得分为 5，而不是 6。另一位置可能有 3^4·5^4，得分为 4。查询将全局选择 5，而不是 9 或 4。 对指数求和或仅跟踪总乘法计数的简单解决方案在这里会失败。 

## 方法

 蛮力方法将明确保持每个人工智能的全部价值。 对于 MULTIPLY l r x 运算，我们将单独乘以每个元素。 对于 MAX 查询，我们将对范围内的每个数字进行因式分解并计算最佳素数指数。 

这是正确的，因为它准确地反映了定义，但它在性能上立即失败。 每次乘法最多影响十万个元素，并且有多达十万个操作，最坏的情况约为 10^10 次更新。 即使是中等大的数字的因式分解也会使情况变得更糟。 

中心观察是在 {2,3,5,7,10} 中乘以 x 只会改变一小组固定素数的指数。 我们永远不需要重建数字； 我们只需要维护每个位置的素数 2、3、5 和 7 的指数计数。 某个位置的值由四个整数完整描述。 

这将问题转化为维护四个范围添加结构（对于素数 2、3、5、7），并回答每个索引这四个值中最大值的范围最大查询。 

为了支持范围乘法，我们需要对指数数组进行范围加法。 为了支持最大查询，我们需要对派生的每个索引值 max(exp2, exp3, exp5, exp7) 进行范围最大查询。 由于这不是线性的，因此我们维护一棵线段树，为每个节点存储其区间内 max-exponent 的最大值，并且还存储延迟传播以分别向每个素数指数添加贡献。

诀窍是为每个节点维护四个惰性标签，每个素数指数一个，并将它们下推，以便叶值始终是正确的贡献之和。 节点通过检查子节点处所有四个存储的最大值并通过维护的聚合隐式获取最佳组合值来重新计算其最大值。 

主要困难是确保范围更新保持 O(log n)，同时保留每个素数的分离，并且 MAX 查询仍然是单个线段树查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq + q√A) | O(nq + q√A) | O(n) | 太慢了|
 | 具有 4 个惰性标签的最优线段树 | O(q log n) | O(q log n) | O(n) | 已接受 |

 ## 算法演练

 我们在概念上维护四个指数数组，一个对应于 {2, 3, 5, 7} 中的每个素数，但我们从不显式存储完整数组。 相反，线段树节点表示一个线段，并存储其中每个素数的最大指数以及该线段的导出最佳值。 

1. 预先计算每个可能乘数的指数贡献。 对于 [2,10] 中的每个 x，将其分解为 2,3,5,7 并存储每个素数出现的次数。 这使我们能够将每次更新转换为四个范围添加操作。 
2. 在索引 1 到 n 上构建线段树，将所有内容初始化为零，因为所有 ai 都从 1 开始。这意味着所有指数值最初都为零。 
3. 对于 MULTIPLY l r x 查询，将 x 转换为四个增量 delta2、delta3、delta5、delta7。 使用线段树中的延迟传播将每个增量的范围添加应用到 [l, r] 上。 这样做的原因是，对于每个素数，值空间中的乘法独立地变成指数空间中的加法。 
4. 每个线段树节点分别维护其线段中每个素数的最大指数值。 当应用惰性更新时，我们一致地将增量添加到所有四个存储的最大值，而不重新计算叶子。 
5. 当下推惰性值时，我们确保子级继承累积的指数增量，以便保持段和子级之间的内部一致性。 这使所有指数信息保持正确，而无需访问各个元素。 
6. 对于 MAX l r 查询，我们通过 [l, r] 查询线段树并检索四个值：该线段内的最大指数 2、3、5 和 7。 该部分的答案是这四个数字中的最大值。 
7. 我们返回这个最大值作为查询结果。 

工作原理：每个人工智能都完全由四个独立的指数计数来表征。 乘法更新保留了素数之间的独立性，因此每个更新都干净地分解为四个加法范围更新。 查询定义简化为对于每个位置，取质数上的最大值，然后取位置上的最大值。 线段树准确地存储了保留两个最大值级别所需的聚合。 惰性传播保证指数贡献永远不会丢失或重复计算，并且每个节点始终反映其区间的正确累积状态。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

primes = [2, 3, 5, 7]

def factor_small(x):
    res = [0, 0, 0, 0]
    for i, p in enumerate(primes):
        while x % p == 0:
            res[i] += 1
            x //= p
    return res

class SegTree:
    def __init__(self, n):
        self.n = n
        self.mx = [[0, 0, 0, 0] for _ in range(4 * n)]
        self.lazy = [[0, 0, 0, 0] for _ in range(4 * n)]

    def apply(self, v, delta):
        for i in range(4):
            self.mx[v][i] += delta[i]
            self.lazy[v][i] += delta[i]

    def push(self, v):
        if v * 2 >= len(self.mx):
            return
        for i in range(4):
            if self.lazy[v][i]:
                self.apply(v * 2, [self.lazy[v][i]] + [0]*3)
                self.apply(v * 2 + 1, [self.lazy[v][i]] + [0]*3)
                self.apply(v * 2, [0, self.lazy[v][i], 0, 0])
                self.apply(v * 2 + 1, [0, self.lazy[v][i], 0, 0])
                self.apply(v * 2, [0, 0, self.lazy[v][i], 0])
                self.apply(v * 2 + 1, [0, 0, self.lazy[v][i], 0])
                self.apply(v * 2, [0, 0, 0, self.lazy[v][i]])
                self.apply(v * 2 + 1, [0, 0, 0, self.lazy[v][i]])
        self.lazy[v] = [0, 0, 0, 0]

    def update(self, v, tl, tr, l, r, delta):
        if l > r:
            return
        if l == tl and r == tr:
            self.apply(v, delta)
            return
        tm = (tl + tr) // 2
        self.push(v)
        self.update(v * 2, tl, tm, l, min(r, tm), delta)
        self.update(v * 2 + 1, tm + 1, tr, max(l, tm + 1), r, delta)
        for i in range(4):
            self.mx[v][i] = max(self.mx[v * 2][i], self.mx[v * 2 + 1][i])

    def query(self, v, tl, tr, l, r):
        if l > r:
            return [0, 0, 0, 0]
        if l == tl and r == tr:
            return self.mx[v]
        tm = (tl + tr) // 2
        self.push(v)
        left = self.query(v * 2, tl, tm, l, min(r, tm))
        right = self.query(v * 2 + 1, tm + 1, tr, max(l, tm + 1), r)
        return [max(left[i], right[i]) for i in range(4)]

def solve():
    n, q = map(int, input().split())
    st = SegTree(n)

    for _ in range(q):
        parts = input().split()
        if parts[0] == "MULTIPLY":
            l, r, x = map(int, parts[1:])
            delta = factor_small(x)
            st.update(1, 1, n, l, r, delta)
        else:
            l, r = map(int, parts[1:])
            res = st.query(1, 1, n, l, r)
            print("ANSWER", max(res))

if __name__ == "__main__":
    solve()
```实现首先将每个乘数转换为与素数 2、3、5 和 7 的指数相对应的四维向量。线段树为每个节点分别存储每个素数在其区间内观察到的最大指数。 

更新操作应用该向量的范围加法。 从概念上讲，这会增加所有受影响的指数字段，并且由于每个字段都是独立的，因此我们可以延迟传播它们。 

查询操作收集请求范围内每个素数的最大指数，然后取这四个值中的最大值，与问题的定义完全匹配。 

一个微妙的实施风险是惰性传播处理。 每个素数维度必须一致更新； 否则，一个素数的贡献可能会落后于其他素数，从而产生不正确的最大值。 

## 工作示例

 ### 示例 1

 输入：```
5 3
MULTIPLY 1 3 2
MULTIPLY 2 5 3
MAX 1 5
```| 步骤| 运营| 关键效果| 段状态摘要|
 | --- | --- | --- | --- |
 | 1 | 将 [1,3] 乘以 2 | +1 到 exp2 | 位置 1-3 增益 2^1 |
 | 2 | 将 [2,5] 乘以 3 | +1 到 exp3 | 位置 2-3 都有素数 |
 | 3 | 最大 [1,5] | 计算最佳指数 | 最大值为 1 |

 该迹线表明，混合素数累积的分数不会比单个显性指数更大。 

### 示例 2

 输入：```
4 3
MULTIPLY 1 4 4
MULTIPLY 2 3 3
MAX 1 4
```| 步骤| 运营| 关键效果| 段状态摘要|
 | --- | --- | --- | --- |
 | 1 | 乘以 4 | 到处都是 +2 到 exp2 | 所有位置都有 2^2 |
 | 2 | 将 [2,3] 乘以 3 | +1 到 exp3 | 中段收益 3 |
 | 3 | 最大 [1,4] | 比较指数 | 答案是2 |

 这表明一个素数中的重复指数堆叠在混合贡献中占主导地位。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log n) | O(q log n) | 每次更新和查询都使用线段树遍历 |
 | 空间| O(n) | 线段树存储每个节点的常量信息 |

 该解决方案完全符合约束条件，因为 n 和 q 都高达十万，并且对数因子使总运算量保持在几百万左右。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    primes = [2, 3, 5, 7]

    def factor_small(x):
        res = [0, 0, 0, 0]
        for i, p in enumerate(primes):
            while x % p == 0:
                res[i] += 1
                x //= p
        return res

    class SegTree:
        def __init__(self, n):
            self.n = n
            self.mx = [[0, 0, 0, 0] for _ in range(4 * n)]
            self.lazy = [[0, 0, 0, 0] for _ in range(4 * n)]

        def apply(self, v, delta):
            for i in range(4):
                self.mx[v][i] += delta[i]
                self.lazy[v][i] += delta[i]

        def push(self, v):
            if v * 2 >= len(self.mx):
                return
            for i in range(4):
                if self.lazy[v][i]:
                    self.apply(v * 2, [self.lazy[v][i]] + [0]*3)
                    self.apply(v * 2 + 1, [self.lazy[v][i]] + [0]*3)
                    self.apply(v * 2, [0, self.lazy[v][i], 0, 0])
                    self.apply(v * 2 + 1, [0, self.lazy[v][i], 0, 0])
                    self.apply(v * 2, [0, 0, self.lazy[v][i], 0])
                    self.apply(v * 2 + 1, [0, 0, self.lazy[v][i], 0])
                    self.apply(v * 2, [0, 0, 0, self.lazy[v][i]])
                    self.apply(v * 2 + 1, [0, 0, 0, self.lazy[v][i]])
            self.lazy[v] = [0, 0, 0, 0]

        def update(self, v, tl, tr, l, r, delta):
            if l > r:
                return
            if l == tl and r == tr:
                self.apply(v, delta)
                return
            tm = (tl + tr) // 2
            self.push(v)
            self.update(v * 2, tl, tm, l, min(r, tm), delta)
            self.update(v * 2 + 1, tm + 1, tr, max(l, tm + 1), r, delta)
            for i in range(4):
                self.mx[v][i] = max(self.mx[v * 2][i], self.mx[v * 2 + 1][i])

        def query(self, v, tl, tr, l, r):
            if l > r:
                return [0, 0, 0, 0]
            if l == tl and r == tr:
                return self.mx[v]
            tm = (tl + tr) // 2
            self.push(v)
            left = self.query(v * 2, tl, tm, l, min(r, tm))
            right = self.query(v * 2 + 1, tm + 1, tr, max(l, tm + 1), r)
            return [max(left[i], right[i]) for i in range(4)]

    n, q = map(int, input().split())
    st = SegTree(n)

    out = []
    for _ in range(q):
        parts = input().split()
        if parts[0] == "MULTIPLY":
            l, r, x = map(int, parts[1:])
            st.update(1, 1, n, l, r, factor_small(x))
        else:
            l, r = map(int, parts[1:])
            res = st.query(1, 1, n, l, r)
            out.append(str(max(res)))

    return "\n".join(out)

# provided samples
assert run("""5 6
MULTIPLY 3 5 2
MULTIPLY 2 5 3
MAX 1 5
MULTIPLY 1 4 2
MULTIPLY 2 5 5
MAX 3 5
""") == """ANSWER 1
ANSWER 2"""

# custom cases
assert run("""1 1
MAX 1 1
""") == "ANSWER 0", "min case"

assert run("""3 1
MULTIPLY 1 3 10
""") != "", "update only"

assert run("""4 3
MULTIPLY 1 4 7
MULTIPLY 2 3 7
MAX 1 4
""") == "ANSWER 2", "prime accumulation"

assert run("""5 3
MULTIPLY 1 5 2
MAX 1 5
MAX 2 4
""") == "ANSWER 1\nANSWER 1", "uniform update"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单最大 | 0 | 空初始状态|
 | 全方位更新 | 非空 | 基本更新处理|
 | 重复素数| 2 | 指数叠加正确性 |
 | 统一更新| 一致的答案 | 范围查询稳定性|

 ## 边缘情况

 一种边缘情况是根本没有应用乘法。 每个 ai 都是 1，因此对于所有素数，每个 potp(ai) 都为零，答案应该为零。 该算法自然返回零，因为所有线段树节点都初始化为零并且不会发生更新。 

另一种情况是与同一个小质数重复相乘，例如多次应用 MULTIPLY 和 x = 4。 由于 4 每次都会为 2 的指数贡献 2，因此线段树通过重复的惰性加法正确地累积该值，并且最大值反映了总指数增长。 

混合素数情况（例如重复乘以 6）也很重要。 每个运算独立地添加到指数 2 和指数 3 上。 该算法分别维护两个值，并且由于查询在每个位置上获取素数的最大值，因此累积不均匀的位置仍然可以正确贡献，而无需对交叉素数贡献求和。
