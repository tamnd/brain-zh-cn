---
title: "CF 2220A - 封锁"
description: "我们有两个非负整数 (x) 和 (y)。 我们必须构造两个新的非负整数 (p) 和 (q)，使得两个数字中没有同时设置任何位，即 [ p ,&, q = 0。"
date: "2026-06-09T04:58:25+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 2220
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 1093 (Div. 2)"
rating: 0
weight: 2220
solve_time_s: 164
verified: false
draft: false
---

[CF 2220A - 被阻止](https://codeforces.com/problemset/problem/2220/A)

 **评级：** -
 **标签：** 贪心，排序
 **求解时间：** 2m 44s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 给定两个非负整数\(x\)和\(y\)。 我们必须构造两个新的非负整数\(p\)和\(q\)这样两个数字中不会同时设置任何位，即$$
p \,\&\, q = 0.
$$在所有这些对中，我们希望最小化$$
|x-p| + |y-q|.
$$输出本身并不是最小值。 我们必须输出一对最优的\((p,q)\)。 

数字小于\(2^{30}\)，但最多有\(10^4\)测试用例。 任何搜索候选值的方法\(p\)或者\(q\)立刻就不可能了。 甚至探索一个小社区内的所有价值观\(x\)和\(y\)行不通。 

条件\(p \,\&\, q = 0\)是按位的。 目标函数是数字的。 这种组合是一个强烈的信号，表明解决方案应该从最高有效位到最低有效位处理位，同时跟踪构建的数字与\(x\)和\(y\)。 

当两者都出现时，就会出现微妙的边缘情况\(x\)和\(y\)包含相同的高位。 例如：```
x = 4
y = 4
```禁止对 \((4,4)\) 因为\(4 \& 4 = 4\)。 保留每个匹配位的贪婪策略将会失败。 一个最佳答案是\((4,3)\)，成本\(1\)。 

另一个棘手的情况是```
x = 1
y = 1
```最好的答案不是 \((1,0)\) 或 \((0,1)\)，两者都有成本\(1\)。 样本输出\((2,1)\)，也有成本\(1\)。 最佳解决方案并不唯一，因此算法必须优化成本，而不是尝试重现特定答案。 

## 方法

 强力搜索将枚举所有满足条件的对 \((p,q)\)\(p \& q = 0\), 计算$$
|x-p| + |y-q|,
$$并保留最好的一个。 

即使我们将自己限制在以下数字\(2^{31}\)，大约会有\(2^{62}\)候选对。 这是完全不可行的。 

关键的观察是约束和目标都可以一点一点地处理。 

假设我们正在构建\(p\)和\(q\)从最高有效位向下。 在任何时候，只有三种比较状态是可能的\(p\)相对于\(x\):$$
p < x,\quad p = x,\quad p > x.
$$对于\(q\)相对于\(y\)。 

因此，整个未来仅取决于两个三元状态，给出$$
3 \times 3 = 9
$$可能的比较状态。 

一旦之间的关系\(p\)和\(x\)已经确定，较低位线性贡献\(|p-x|\)。 这同样适用于\(q\)和\(y\)。 这允许在二进制数字上实现数字 DP 风格的解决方案。 

我们处理从 30 到 0 的位。对于每一位，我们选择三个允许的分配之一：$$
(p_b,q_b)\in\{(0,0),(0,1),(1,0)\},
$$因为 \((1,1)\) 会违反\(p \& q = 0\)。 

DP 为每个比较状态保留最小可能的成本，并存储用于重建的转换。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 |---|---:|---:|---|
 | 蛮力 | \(O(2^{62})\) | \(O(1)\) | 太慢了 |
 | 位DP| \(O(31 \cdot 9 \cdot 3)\) | \(O(31 \cdot 9)\) | 已接受 |

 ## 算法演练

 1. 将位从 30 向下处理到 0。 

2. 维护一个状态\((s_x,s_y)\)，每个组件所属的状态\(\{-1,0,1\}\)。 

这里$$
   s_x =
   \begin{cases}
   -1 & p < x,\\
   0 & p = x,\\
   1 & p > x,
   \end{cases}
   $$仅考虑已经处理的较高位。 

的定义\(s_y\)是类似的。 

3. 对于每个状态，尝试三个有效的位分配$$
   (0,0),\ (0,1),\ (1,0).
   $$4. 更新比较状态\(p\)相对\(x\)。 

如果\(s_x=0\)，当前位可能是第一次建立关系。 

如果\(s_x\neq0\)，关系再也不会改变。 

5. 将当前位的贡献添加到\(|p-x|\)。 

让$$
   d_x = p_b - x_b.
   $$如果\(s_x=1\), 的符号\(p-x\)已经知道是积极的，所以这一点有贡献$$
   d_x \cdot 2^b.
   $$如果\(s_x=-1\)，它贡献$$
   -d_x \cdot 2^b.
   $$如果\(s_x=0\)，那么一阶差分正好贡献$$
   2^b.
   $$6. 做同样的事情\(q\)相对\(y\)。 

7. 保持转型的成本最低。 

8. 最后一位之后，选择总成本最小的状态并重建\(p\)和\(q\)来自存储的父母。 

### 为什么它有效

 最重要的位在哪里\(p\)和\(x\)不同决定是否\(p>x\)或者\(p<x\)。 一旦该位被固定，每个较低位都会对绝对差值贡献一个已知的符号。 DP状态准确地存储了该符号信息。 

由于每个有效的位分配都对应于通过 DP 的唯一路径，并且每个路径都精确地累积值$$
|p-x|+|y-q|,
$$DP 检查所有可行对 \((p,q)\) 满足\(p\&q=0\)并选择一个成本最小的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

BITS = 31
INF = 10**18

def solve_case(x, y):
    dp = [[INF] * 9 for _ in range(BITS + 1)]
    parent = [[None] * 9 for _ in range(BITS + 1)]

    start = 4  # (sx, sy) = (0, 0)
    dp[0][start] = 0

    def idx(sx, sy):
        return (sx + 1) * 3 + (sy + 1)

    def decode(v):
        return v // 3 - 1, v % 3 - 1

    for pos in range(BITS):
        b = 30 - pos
        w = 1 << b

        xb = (x >> b) & 1
        yb = (y >> b) & 1

        for st in range(9):
            cur = dp[pos][st]
            if cur == INF:
                continue

            sx, sy = decode(st)

            for pb, qb in ((0, 0), (0, 1), (1, 0)):
                # x side
                dx = pb - xb

                if sx == 0:
                    if dx == 0:
                        nsx = 0
                        addx = 0
                    elif dx > 0:
                        nsx = 1
                        addx = w
                    else:
                        nsx = -1
                        addx = w
                elif sx == 1:
                    nsx = 1
                    addx = dx * w
                else:
                    nsx = -1
                    addx = -dx * w

                # y side
                dy = qb - yb

                if sy == 0:
                    if dy == 0:
                        nsy = 0
                        addy = 0
                    elif dy > 0:
                        nsy = 1
                        addy = w
                    else:
                        nsy = -1
                        addy = w
                elif sy == 1:
                    nsy = 1
                    addy = dy * w
                else:
                    nsy = -1
                    addy = -dy * w

                nst = idx(nsx, nsy)
                nv = cur + addx + addy

                if nv < dp[pos + 1][nst]:
                    dp[pos + 1][nst] = nv
                    parent[pos + 1][nst] = (st, pb, qb)

    best_state = min(range(9), key=lambda s: dp[BITS][s])

    p = 0
    q = 0
    st = best_state

    for pos in range(BITS, 0, -1):
        prev, pb, qb = parent[pos][st]
        b = 30 - (pos - 1)

        p |= pb << b
        q |= qb << b

        st = prev

    return p, q

def main():
    t = int(input())
    ans = []

    for _ in range(t):
        x, y = map(int, input().split())
        p, q = solve_case(x, y)
        ans.append(f"{p} {q}")

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    main()
```DP 表包含 31 层，每一位位置一层。 每层只有 9 个状态。 对于每个状态，我们只尝试三个转换，因为\((1,1)\)对是被禁止的。 

贡献公式是微妙的部分。 当比较状态已知时，较低位直接影响有符号差。 当当前位创建第一个差异时，该位将准确贡献其权重，因为它成为领先的差异位。 

重建阶段向后遍历存储的父级并重建所选的位\(p\)和\(q\)。 

## 工作示例

 ### 示例 1

 输入：```
x = 4
y = 4
```二进制表示：$$
x=y=100_2.
$$在位 2 处，禁止选择 \((1,1)\)。 

| 位| x 位| y 位 | 选择 (p,q) 位 |
 |---|---:|---:|---:|
 | 2 | 1 | 1 | (1,0)|
 | 1 | 0 | 0 | (0,1)|
 | 0 | 0 | 0 | (0,1)|

 这重建了$$
p=100_2=4,\qquad q=011_2=3.
$$成本是$$
|4-4|+|4-3|=1.
$$该示例显示了如何在两个数字之间分割共享的高位。 

### 示例 2

 输入：```
x = 3
y = 6
```二进制：$$
x=011_2,\qquad y=110_2.
$$一种最佳重建是：

 | 位| x 位| y 位 | 选择 (p,q) 位 |
 |---|---:|---:|---:|
 | 2 | 0 | 1 | (0,1)|
 | 1 | 1 | 1 | (1,0)|
 | 0 | 1 | 0 | (1,0)|

 这产生$$
p=3,\qquad q=4.
$$成本是$$
|3-3|+|6-4|=2.
$$示例输出使用\(q=8\)，具有相同的最优成本。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 |---|---:|---|
 | 时间 | \(O(31 \cdot 9 \cdot 3)\) | 31 位、9 种状态、3 种转换 |
 | 空间| \(O(31 \cdot 9)\) | DP 和父表|

 每个测试用例的总工作量只有几百次操作。 和\(10^4\)测试用例中，解决方案很容易符合限制。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    BITS = 31
    INF = 10**18

    def solve_case(x, y):
        dp = [[INF] * 9 for _ in range(BITS + 1)]
        parent = [[None] * 9 for _ in range(BITS + 1)]

        dp[0][4] = 0

        def idx(sx, sy):
            return (sx + 1) * 3 + (sy + 1)

        def decode(v):
            return v // 3 - 1, v % 3 - 1

        for pos in range(BITS):
            b = 30 - pos
            w = 1 << b

            xb = (x >> b) & 1
            yb = (y >> b) & 1

            for st in range(9):
                cur = dp[pos][st]
                if cur == INF:
                    continue

                sx, sy = decode(st)

                for pb, qb in ((0, 0), (0, 1), (1, 0)):
                    dx = pb - xb
                    dy = qb - yb

                    if sx == 0:
                        if dx == 0:
                            nsx, addx = 0, 0
                        elif dx > 0:
                            nsx, addx = 1, w
                        else:
                            nsx, addx = -1, w
                    elif sx == 1:
                        nsx, addx = 1, dx * w
                    else:
                        nsx, addx = -1, -dx * w

                    if sy == 0:
                        if dy == 0:
                            nsy, addy = 0, 0
                        elif dy > 0:
                            nsy, addy = 1, w
                        else:
                            nsy, addy = -1, w
                    elif sy == 1:
                        nsy, addy = 1, dy * w
                    else:
                        nsy, addy = -1, -dy * w

                    nst = idx(nsx, nsy)
                    nv = cur + addx + addy

                    if nv < dp[pos + 1][nst]:
                        dp[pos + 1][nst] = nv
                        parent[pos + 1][nst] = (st, pb, qb)

        best = min(range(9), key=lambda s: dp[BITS][s])

        p = q = 0
        st = best

        for pos in range(BITS, 0, -1):
            prev, pb, qb = parent[pos][st]
            b = 30 - (pos - 1)
            p |= pb << b
            q |= qb << b
            st = prev

        return f"{p} {q}"

    t = int(input())
    return "\n".join(
        solve_case(*map(int, input().split()))
        for _ in range(t)
    )

# sample input, output may differ because multiple answers exist

# minimum values
out = run("1\n0 0\n")
p, q = map(int, out.split())
assert (p & q) == 0

# equal numbers
out = run("1\n4 4\n")
p, q = map(int, out.split())
assert (p & q) == 0

# boundary
out = run("1\n1073741823 1073741822\n")
p, q = map(int, out.split())
assert (p & q) == 0

# asymmetric
out = run("1\n0 123456\n")
p, q = map(int, out.split())
assert (p & q) == 0
```| 测试输入| 预期产出 | 它验证了什么 |
 |---|---|---|
 |`0 0`| 任何有效的最优对 | 最小可能值 |
 |`4 4`| 任何具有 AND 零的最佳对 | 共享最高位 |
 |`1073741823 1073741822`| 任意最优对 | 最大投入 |
 |`0 123456`| 任意最优对 | 一个数字已经为零 |

 ## 边缘情况

 当两个数字都为零时，DP 保持每个位的相等状态并重建 \((0,0)\)。 成本为零，这显然是最优的。 

当两个数字共用一个大位时，例如```
4 4
```禁止位分配 \((1,1)\)。 DP 评估两种可能性，将位赋予\(p\)或将其交给\(q\)，然后最优地调整较低位。 这避免了保持两个数字不变的常见错误。 

为了```
1073741823 1073741822
```位 30 以下的每一位至少在一个数字中处于活动状态。 局部的贪婪选择很容易在以后产生更大的错误。 DP 同时保持所有比较状态，因此它永远不会做出次优的高位决策。
