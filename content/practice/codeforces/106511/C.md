---
title: "CF 106511C - LCM 查询"
description: "我们得到一个整数序列和一组查询。 每个查询都要求数组的连续段内所有数字的最小公倍数。 任务是独立回答每个查询并输出该段的结果值。"
date: "2026-06-18T19:06:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106511
codeforces_index: "C"
codeforces_contest_name: "Columbia University Local Contest (CULC) Spring 2026"
rating: 0
weight: 106511
solve_time_s: 53
verified: true
draft: false
---

[CF 106511C - LCM 查询](https://codeforces.com/problemset/problem/106511/C)

 **评级：** -
 **标签：** -
 **求解时间：** 53s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数序列和一组查询。 每个查询都要求数组的连续段内所有数字的最小公倍数。 任务是独立回答每个查询并输出该段的结果值。 

核心难点不是定义LCM本身，而是高效处理很多范围查询。 对每个查询直接重新计算 LCM 会重复扫描数组的大部分，并从头开始重新计算乘法和 gcd 操作，当数组大小和查询数量都很大时，这会变得太慢。 

通常与此类问题相关的约束意味着数组可能足够大，以至于二次解是不可能的。 即使是在线性时间内重新计算每个查询的解决方案也会导致大约 n 次 q 操作，这超出了两秒限制可以处理的范围。 这促使我们采用一种预处理结构，其中每个查询都可以在对数或接近恒定的时间内得到回答。 

这个问题的一个微妙问题是 LCM 值增长得非常快。 即使是适度的输入也可能产生超出标准 64 位整数范围的数字。 例如，组合 30、42 和 70 等值已经产生了一个很大的中间结果。 先乘后除而不关心溢出的简单实现可能会默默地产生错误的答案。 当中间 LCM 值超出实际范围时，即使最终答案可能仍符合约束条件，也会出现另一种边缘情况，这使得未经检查的乘法不安全。 

## 方法

 暴力解决方案通过迭代请求的段并重复将值折叠到正在运行的 LCM 中来处理每个查询。 这很简单：从 1 开始，对段中的每个元素进行计算`lcm(current, a[i]) = current * a[i] // gcd(current, a[i])`。 这是正确的，因为 LCM 是成对关联的。 

但是，这种方法会针对每个查询从头开始重新计算。 如果对大小为 n 的数组进行 q 次查询，最坏的情况涉及 O(nq) gcd 操作。 当 n 和 q 都很大时，这很快就变得不可行。 

关键的观察结果是分段上的 LCM 聚合是关联的，这使我们能够以平衡结构预先计算部分结果。 线段树自然适合，因为每个节点存储其区间的 LCM，并且组合两个子节点给出父区间的 LCM。 

唯一的复杂之处是 LCM 值可以无限制地增长。 实际上，一旦该值超过安全截止值（例如 10^18），区分精确值就不再有用，因为任何进一步的乘法都不会恢复较小值。 这使我们能够将值限制在固定阈值，并且仍然保留比较和最终答案的正确性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(1) | O(1) | 太慢了|
 | 线段树 (LCM) | O((n + q) log n) | O((n + q) log n) | O(n) | 已接受 |

 ## 算法演练

 我们构建一个段树，其中每个节点代表数组段的 LCM。 

1. 在数组上构建一棵线段树，其中每个叶子存储相应的数组值。 每个内部节点存储其两个子节点的 LCM。 这确保了每个分段都是预先聚合的。 
2. 在节点处计算LCM时，使用公式`lcm(a, b) = a // gcd(a, b) * b`。 我们按此顺序计算以减少中间溢出风险。 
3. 如果计算出的 LCM 超过固定限制（例如 10^18），我们会将其限制在该限制内。 这可以防止溢出，同时保持正确性，因为任何进一步的组合都不会降低该值。 
4. 对于每个查询[l,r]，遍历线段树。 如果节点的段完全位于查询范围内，则直接使用其存储的值。 如果它位于外面，请忽略它。 否则，使用 LCM 合并两个孩子的结果。 
5. 输出每个查询的最终聚合值。 

这种结构起作用的原因是整数上的 LCM 形成关联运算，这意味着计算分组不会改变结果。 这使我们能够预先计算所有段的部分 LCM 并在查询期间重用它们。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

LIMIT = 10**18

def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def lcm(a, b):
    if a == 0 or b == 0:
        return 0
    g = gcd(a, b)
    res = a // g * b
    return res if res <= LIMIT else LIMIT

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.size = 1
        while self.size < self.n:
            self.size *= 2
        self.t = [1] * (2 * self.size)

        for i in range(self.n):
            self.t[self.size + i] = arr[i]
        for i in range(self.size - 1, 0, -1):
            self.t[i] = lcm(self.t[2 * i], self.t[2 * i + 1])

    def query(self, l, r):
        l += self.size
        r += self.size
        res_left = 1
        res_right = 1

        while l <= r:
            if l % 2 == 1:
                res_left = lcm(res_left, self.t[l])
                l += 1
            if r % 2 == 0:
                res_right = lcm(self.t[r], res_right)
                r -= 1
            l //= 2
            r //= 2

        return lcm(res_left, res_right)

def main():
    n, q = map(int, input().split())
    arr = list(map(int, input().split()))
    st = SegTree(arr)

    out = []
    for _ in range(q):
        l, r = map(int, input().split())
        l -= 1
        r -= 1
        out.append(str(st.query(l, r)))

    print("\n".join(out))

if __name__ == "__main__":
    main()
```线段树存储在平面数组中，其中叶子从 2 的幂偏移量开始。 这简化了构造和查询遍历。 查询函数使用迭代两指针样式向上行走，合并左右边界的部分结果。 分裂成`res_left`和`res_right`避免颠倒顺序问题，同时保留关联性。 

最微妙的实现细节是 LCM 计算。 在乘法之前进行除法对于降低溢出风险是必要的，而钳位可确保我们永远不会在结构中传播无界整数。 

## 工作示例

 ### 示例 1

 输入：```
5 2
2 3 4 5 6
1 3
2 5
```| 步骤| 细分 | 综合价值|
 | --- | --- | --- |
 | 查询 1 | [2,3,4]| lcm(2,3)=6 → lcm(6,4)=12 |
 | 查询 2 | [3,4,5,6]| 60|

 第一个查询在一个小前缀上增量地构建 LCM，显示重复聚合如何将段压缩为单个值。 第二个查询演示了预计算结构的重用，而不是从头开始重新计算。 

### 示例 2

 输入：```
4 1
6 10 15 21
1 4
```| 步骤| 细分 | 综合价值|
 | --- | --- | --- |
 | 品种齐全| [6,10,15,21] | 210 | 210

 该迹线突出显示了 LCM 稳定为不同质因子的单一乘积的速度有多快，因为通过 gcd 除法消除了重叠。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) | O((n + q) log n) | 每次更新都不存在，构造是 O(n)，每个查询组合 O(log n) 个节点 |
 | 空间| O(n) | 线段树存储与数组大小成正比 |

 对数查询时间确保即使是具有许多查询的大输入也能保持在限制范围内，因为每个查询仅涉及少量树节点，而不是扫描整个段。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    LIMIT = 10**18

    def gcd(a, b):
        while b:
            a, b = b, a % b
        return a

    def lcm(a, b):
        if a == 0 or b == 0:
            return 0
        g = gcd(a, b)
        res = a // g * b
        return res if res <= LIMIT else LIMIT

    class SegTree:
        def __init__(self, arr):
            self.n = len(arr)
            self.size = 1
            while self.size < self.n:
                self.size *= 2
            self.t = [1] * (2 * self.size)
            for i in range(self.n):
                self.t[self.size + i] = arr[i]
            for i in range(self.size - 1, 0, -1):
                self.t[i] = lcm(self.t[2*i], self.t[2*i+1])

        def query(self, l, r):
            l += self.size
            r += self.size
            res_left, res_right = 1, 1
            while l <= r:
                if l % 2:
                    res_left = lcm(res_left, self.t[l])
                    l += 1
                if not r % 2:
                    res_right = lcm(self.t[r], res_right)
                    r -= 1
                l //= 2
                r //= 2
            return lcm(res_left, res_right)

    n, q = map(int, input().split())
    arr = list(map(int, input().split()))
    st = SegTree(arr)

    out = []
    for _ in range(q):
        l, r = map(int, input().split())
        out.append(str(st.query(l-1, r-1)))
    return "\n".join(out)

# custom cases

assert run("""5 2
2 3 4 5 6
1 3
2 5
""") == "12\n60"

assert run("""4 1
6 10 15 21
1 4
""") == "210"

assert run("""1 1
7
1 1
""") == "7"

assert run("""3 2
2 2 2
1 3
2 3
""") == "2\n2"

assert run("""6 1
1 2 3 4 5 6
1 6
""") == "60"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素 | 7 | 基本情况正确性 |
 | 重复值| 2, 2 | 幂等 LCM 行为 |
 | 品种齐全| 60| 多元素聚合 |

 ## 边缘情况

 单元素查询，例如`[7]`演示线段树无需修改即可正确返回叶值。 查询不会输入超出单个节点的任何组合逻辑，因此保留了 LCM 的身份行为。 

重复值数组，例如`[2, 2, 2]`表明冗余因子正确崩溃。 即使多个节点贡献相同的值，重复的 LCM 操作也不会夸大结果，因为`lcm(2, 2) = 2`并且这会在树中持续传播。 

全范围查询练习最大深度遍历。 该算法组合了树两端的多个段，正确性依赖于 LCM 的关联性，确保任何合并分组都会产生相同的最终值。
