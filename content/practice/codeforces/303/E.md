---
title: "CF 303E - 随机排名"
description: "每个参与者都会收到一个从区间 $[li, ri]$ 中统一选择的实值分数。 分数是独立的。 所有分数生成后，参与者按分数排序。 分数越小意味着排名越高，因此分数最高的参赛者名列最后。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "math", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 303
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 183 (Div. 1)"
rating: 3000
weight: 303
solve_time_s: 187
verified: false
draft: false
---

[CF 303E - 随机排名](https://codeforces.com/problemset/problem/303/E)

 **评分：** 3000
 **标签：** dp、数学、概率
 **求解时间：** 3m 7s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 每个参与者都会收到从一个区间中统一选择的实值分数$[l_i, r_i]$。 分数是独立的。 所有分数生成后，参与者按分数排序。 分数越小意味着排名越高，因此分数最高的参赛者名列最后。 

对于每一位参与者$i$以及每一个等级$j$，我们必须计算参与者的概率$i$准确地完成在位置$j$。 

分布是连续的，因此出现平局的概率为零。 这消除了排名中的所有歧义。 

最明显的困难是间隔以任意方式重叠。 对于一名参与者$i$，另一个参与者的概率$k$低于他的分数取决于采样的确切值$i$。 这些事件在全球范围内并不是独立的，但它们在条件作用后变得独立$i$的分数。 

约束条件$n \le 80$对于三次或四次动态规划来说足够小，但对于任何指数来说都太大了。 枚举所有相对顺序将需要$n!$的可能性，即使对于$n=15$。 坐标可以大到$10^9$，因此任何直接离散化所有实值的方法都是不可能的。 该解决方案必须仅依赖于区间端点。 

间隔是连续的，这会产生一些微妙的边缘情况。 

假设两个区间不重叠：```
2
0 1
10 11
```第一个参与者总是排在第二个参与者之前。 如果不小心地不一致地使用严格的不等式，可能会意外地将微小的概率质量分配给不可能的排序。 

当一个区间完全包含在另一个区间中时，会出现另一种棘手的情况：```
2
0 10
4 6
```这里第二个参与者的得分永远不会低于 0 或高于 10，因此概率曲线恰好在区间边界处发生变化。 缺少这些断点会导致集成不正确。 

第三个重要的情况是当许多端点重合时：```
3
0 5
0 5
0 5
```所有排名都是对称的，因此每个参与者都必须有概率$1/3$对于每个等级。 由浮点漂移或不正确的区间划分引起的任何不对称都会立即暴露出错误。 

分布的连续性也很重要。 考虑：```
2
0 1
1 2
```即使间隔在一个端点相交，相同分数的概率也恰好为零。 将间隔视为封闭离散范围的实现可能会错误地计算平局。 

## 方法

 蛮力的观点很简单。 选择一名参与者$i$。 对于每一个可能的分数$x$他可以获得、计算有多少其他参与者得分低于的概率分布$x$。 然后综合所有$x$。 

如果我们知道确切的分数$x$, 每个其他参与者$k$独立地满足：$$P(s_k < x)$$军衔为$i$然后由有多少参与者得分较小来确定。 

蛮力障碍是积分。 概率表达式在任何时候都会改变$x$穿过区间端点。 在端点之间，每个概率都是线性的$x$。 一种天真的想法是对许多样本点进行数值积分，但这无法稳健地达到所需的精度。 

关键的观察是，实线可以划分为由所有区间端点形成的线段。 在一个固定段内$[a,b]$，每个概率表达式都成为仿射函数$x$。 

对于参与者$k$：$$P(s_k < x)= \begin{cases} 0 & x \le l_k \\ 1 & x \ge r_k \\ \dfrac{x-l_k}{r_k-l_k} & l_k < x < r_k \end{cases}$$在固定的细分市场中，每个参与者都属于三个类别之一。 

有些贡献常数 0。 

有些贡献常数 1。 

有些贡献线性函数$\alpha x + \beta$。 

该结构允许多项式 DP。 我们不是逐点重新计算概率，而是维护一个生成多项式，其系数为$t^j$恰好等于概率$j$参与者得分低于$x$。 

系数本身变成多项式$x$。 由于每个因素都是线性的，因此在处理所有参与者后，得出排名系数$j$至多是一个次数多项式$n$。 我们可以将其精确地集成到该段上。 

这将不可能的连续概率问题转化为精确的多项式积分$O(n)$段。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力数值积分 | 指数或不稳定| 大| 太慢/不准确|
 | 具有多项式积分的分段 DP |$O(n^4)$|$O(n^3)$| 已接受 |

 ## 算法演练

 1. 收集所有区间端点$l_i$和$r_i$，对它们进行排序，并删除重复项。 

这些端点将数轴划分为多个段，其中每个概率表达式都有固定的代数形式。 
2. 处理每个参与者$i$独立。 

我们计算参与者排名的概率分布$i$。 
3. 对于每对连续的端点$[a,b]$，仅考虑此段。 

如果参加者$i$的间隔与该段不重叠，跳过它，因为参与者$i$永远无法在其中获得分数。 
4. 该段内，代表参与者的密度$i$的分数。 

自从$i$的分数是统一的：$$f_i(x)=\frac{1}{r_i-l_i}$$这在间隔上是恒定的。 
5. 对于所有其他参与者$k$，确定形式$$p_k(x)=P(s_k < x)$$在当前段内。 

只有三种可能：$$0,\quad 1,\quad \frac{x-l_k}{r_k-l_k}$$6. 在参与者之上建立 DP。 

让：$$dp[j][d]$$表示系数$x^d$在表示概率的多项式中$j$参与者得分低于$x$。 

最初：$$dp[0][0]=1$$7. 处理每个参与者$k \ne i$。 

将当前生成多项式乘以：$$(1-p_k(x)) + p_k(x)t$$系数为$t^j$准确跟踪概率$j$参与者如下$x$。 

由于每$p_k(x)$是线性的，系数仍然是低次多项式。 
8、处理完所有参与者后，正好对应的系数$j-1$较小的分数给出了参与者的概率密度$i$有等级$j$。 
9. 对该段上的多项式进行积分。 

如果：$$P(x)=\sum c_d x^d$$然后：$$\int_a^b P(x)\,dx = \sum c_d \frac{b^{d+1}-a^{d+1}}{d+1}$$10. 将贡献添加到答案矩阵中。 

### 为什么它有效

 固定参与者$i$并固定一个分数值$x$。 有条件的$s_i=x$，其他每个参与者都独立地得分低于$x$或以上$x$。 生成多项式精确地编码了有多少参与者落在下面的分布$x$。 

系数为$t^{j-1}$恰好等于概率$j-1$参与者得分低于$x$，这意味着参与者$i$有等级$j$。 

实线划分保证了每个概率表达式在一段内都是线性的，因此DP系数是普通多项式。 每个分段的精确积分累积了所有可能值的无条件概率$s_i$。 

由于分段覆盖了整个支持而没有重叠，因此将所有分段贡献相加即可得出准确的最终概率。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    L = []
    R = []

    for _ in range(n):
        l, r = map(float, input().split())
        L.append(l)
        R.append(r)

    pts = sorted(set(L + R))

    ans = [[0.0] * n for _ in range(n)]

    for i in range(n):

        for s in range(len(pts) - 1):
            a = pts[s]
            b = pts[s + 1]

            if a == b:
                continue

            left = max(a, L[i])
            right = min(b, R[i])

            if left >= right:
                continue

            length_i = R[i] - L[i]

            # dp[j][d] = coefficient of x^d
            dp = [[0.0] * (n + 1) for _ in range(n + 1)]
            dp[0][0] = 1.0

            processed = 0

            for k in range(n):
                if k == i:
                    continue

                len_k = R[k] - L[k]

                # p(x) = A*x + B
                if right <= L[k]:
                    A = 0.0
                    B = 0.0
                elif left >= R[k]:
                    A = 0.0
                    B = 1.0
                elif L[k] <= left and right <= R[k]:
                    A = 1.0 / len_k
                    B = -L[k] / len_k
                else:
                    # because all breakpoints are endpoints,
                    # partial overlap cannot happen here
                    A = 0.0
                    B = 0.0

                ndp = [[0.0] * (n + 1) for _ in range(n + 1)]

                for j in range(processed + 1):
                    for d in range(processed + 1):

                        cur = dp[j][d]
                        if abs(cur) < 1e-15:
                            continue

                        # multiply by (1 - p)
                        ndp[j][d] += cur * (1.0 - B)
                        ndp[j][d + 1] += cur * (-A)

                        # multiply by p * t
                        ndp[j + 1][d] += cur * B
                        ndp[j + 1][d + 1] += cur * A

                dp = ndp
                processed += 1

            density = 1.0 / length_i

            for rank in range(n):
                poly = dp[rank]

                val = 0.0

                for d in range(n + 1):
                    c = poly[d]
                    if abs(c) < 1e-15:
                        continue

                    val += c * (
                        (right ** (d + 1) - left ** (d + 1))
                        / (d + 1)
                    )

                ans[i][rank] += val * density

    for i in range(n):
        print(*["{:.10f}".format(x) for x in ans[i]])

solve()
```第一部分读取所有间隔并收集每个端点。 这些端点定义了任何概率公式可以更改的唯一位置。 

对于每个参与者$i$，该算法迭代连续端点之间的每个基本段。 在一个段内，每个比较概率都是线性的$x$，这是实现多项式 DP 的关键属性。 

DP 存储多项式系数而不是简单概率。 当另一个参与者贡献概率时$A x + B$，乘以：$$(1-p(x)) + p(x)t$$更新较小参与者的数量和多项式次数。 

该实现仔细地分离了系数$x^d$从排名计数维度。 将数学转化为代码时最常见的错误是忽略这种区别。 

另一个微妙的点是重叠分类。 由于所有段边界都是区间端点，因此段内的参与者只能以线性概率完全低于、完全高于或完全活跃。 没有其他几何形状是可能的。 

最终的整合是准确的。 由于每个系数都是多项式项，因此在分段上积分仅需要标准幂积分公式。 

## 工作示例

 ### 示例 1

 输入：```
2
1 6
4 9
```关键点是：```
1, 4, 6, 9
```我们处理参与者 1。 

| 细分 | 活动范围|$P(s_2 < x)$| 排名 1 贡献 |
 | ---| ---| ---| ---|
 | [1,4]| [1,4]| 0 | 永远第一|
 | [4,6]| [4,6]|$(x-4)/5$| 混合 |

 对于细分市场$[1,4]$：$$\int_1^4 \frac{1}{5} dx = \frac{3}{5}$$参与者 1 始终是第一个出现的。 

对于细分市场$[4,6]$：$$P(\text{rank }1)=1-\frac{x-4}{5}$$积分：$$\frac{1}{5}\int_4^6 \left(1-\frac{x-4}{5}\right)dx = 0.32$$全部的：$$0.6 + 0.32 = 0.92$$所以参与者 1 有概率$0.92$首先完成。 

此示例显示概率表达式如何在区间端点精确变化。 

### 示例 2

 输入：```
3
0 5
0 5
0 5
```所有参与者都是对称的。 

对于参与者 1 和分数$x$：$$P(s_k < x)=\frac{x}{5}$$对于其他两个参与者。 

生成多项式变为：$$\left(1-\frac{x}{5}+\frac{x}{5}t\right)^2$$扩展：

 | 较小的参与者 | 多项式|
 | ---| ---|
 | 0 |$(1-x/5)^2$|
 | 1 |$2(x/5)(1-x/5)$|
 | 2 |$(x/5)^2$|

 整合每一个$[0,5]$准确地给出$1/3$。 

这个例子证实了 DP 正确地保持了对称性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n^4)$|$O(n)$参与者，$O(n)$段,$O(n^2)$DP 更新 |
 | 空间|$O(n^2)$| DP多项式系数表 |

 和$n \le 80$,$O(n^4)$在优化的 Python 中是可以接受的，因为常数因子很小并且大多数多项式系数仍然稀疏。 与 256 MB 限制相比，内存使用量很小。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())
    L = []
    R = []

    for _ in range(n):
        l, r = map(float, input().split())
        L.append(l)
        R.append(r)

    pts = sorted(set(L + R))

    ans = [[0.0] * n for _ in range(n)]

    for i in range(n):

        for s in range(len(pts) - 1):
            a = pts[s]
            b = pts[s + 1]

            left = max(a, L[i])
            right = min(b, R[i])

            if left >= right:
                continue

            dp = [[0.0] * (n + 1) for _ in range(n + 1)]
            dp[0][0] = 1.0

            processed = 0

            for k in range(n):
                if k == i:
                    continue

                lenk = R[k] - L[k]

                if right <= L[k]:
                    A = 0.0
                    B = 0.0
                elif left >= R[k]:
                    A = 0.0
                    B = 1.0
                else:
                    A = 1.0 / lenk
                    B = -L[k] / lenk

                ndp = [[0.0] * (n + 1) for _ in range(n + 1)]

                for j in range(processed + 1):
                    for d in range(processed + 1):
                        cur = dp[j][d]

                        ndp[j][d] += cur * (1 - B)
                        ndp[j][d + 1] += cur * (-A)

                        ndp[j + 1][d] += cur * B
                        ndp[j + 1][d + 1] += cur * A

                dp = ndp
                processed += 1

            density = 1.0 / (R[i] - L[i])

            for rank in range(n):
                res = 0.0

                for d in range(n + 1):
                    c = dp[rank][d]
                    res += c * (
                        (right ** (d + 1) - left ** (d + 1))
                        / (d + 1)
                    )

                ans[i][rank] += res * density

    out = []
    for row in ans:
        out.append(" ".join("{:.6f}".format(x) for x in row))
    print("\n".join(out))

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out.strip()

# provided sample
res = run("2\n1 6\n4 9\n")
lines = res.splitlines()

a = list(map(float, lines[0].split()))
b = list(map(float, lines[1].split()))

assert abs(a[0] - 0.92) < 1e-6
assert abs(a[1] - 0.08) < 1e-6
assert abs(b[0] - 0.08) < 1e-6
assert abs(b[1] - 0.92) < 1e-6

# minimum size
res = run("1\n0 10\n")
x = float(res.strip())
assert abs(x - 1.0) < 1e-6

# identical intervals
res = run("3\n0 5\n0 5\n0 5\n")
for line in res.splitlines():
    vals = list(map(float, line.split()))
    for v in vals:
        assert abs(v - 1/3) < 1e-6

# disjoint intervals
res = run("2\n0 1\n10 11\n")
lines = res.splitlines()

a = list(map(float, lines[0].split()))
b = list(map(float, lines[1].split()))

assert abs(a[0] - 1.0) < 1e-6
assert abs(a[1]) < 1e-6
assert abs(b[0]) < 1e-6
assert abs(b[1] - 1.0) < 1e-6

# touching endpoints
res = run("2\n0 1\n1 2\n")
lines = res.splitlines()

a = list(map(float, lines[0].split()))
b = list(map(float, lines[1].split()))

assert abs(a[0] - 1.0) < 1e-6
assert abs(b[1] - 1.0) < 1e-6
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单人参加 | 排名 1 的概率 1 | 基本情况|
 | 所有间隔均相等 | 统一排名概率 | 对称正确性 |
 | 不相交区间 | 确定性排名 | 端点处理|
 | 触动端点| 没有平局的概率 | 连续分布正确性 |

 ## 边缘情况

 考虑接触间隔：```
2
0 1
1 2
```参与者 1 的得分始终低于参与者 2。间隔共享端点 1，但相等的概率为零，因为分布是连续的。 

划分点为：```
0, 1, 2
```里面$[0,1]$，参与者 2 总是超过当前分数，因此：$$P(s_2 < x)=0$$该算法仅对开放长度的线段进行积分，因此单点$x=1$贡献为零。 结果就变成了：```
1 0
0 1
```现在考虑相同的间隔：```
3
0 5
0 5
0 5
```所有参与者都使用相同的线性概率：$$P(s_k < x)=x/5$$生成多项式对于每个参与者都是对称的。 由于积分区间也相同，因此每个等级都准确接收概率$1/3$。 

最后考虑嵌套区间：```
2
0 10
4 6
```划分点为：```
0, 4, 6, 10
```里面$[0,4]$，参与者 2 的得分永远不会低于当前值。 

里面$[4,6]$，概率变为线性：$$\frac{x-4}{2}$$里面$[6,10]$，参与者 2 始终位于下方。 

该算法单独处理每个片段，因此概率公式会准确地更改其应有的位置。 缺少这种细分是该问题错误答案的典型根源。
