---
title: "CF 102576F - 半智者"
description: "我们有一排 n 名唯一编号的士兵。 目标是将当前排列转换为排序顺序。 允许的操作是交换相邻的士兵，反转整行，或者支付固定成本来随机化整行。"
date: "2026-07-31T07:34:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102576
codeforces_index: "F"
codeforces_contest_name: "2020 Petrozavodsk Winter Camp, Jagiellonian U Contest"
rating: 0
weight: 102576
solve_time_s: 94
verified: true
draft: false
---

[CF 102576F - 半witters](https://codeforces.com/problemset/problem/102576/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 34s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 我们有一排`n`具有唯一编号的士兵。 目标是将当前排列转换为排序顺序。 允许的操作是交换相邻的士兵，反转整行，或者支付固定成本来随机化整行。 随机化后，该行均匀分布在所有`n!`可能的排列，因此每个州的未来预期成本都是相同的。 

对于每个起始排列，我们需要最佳的预期时间。 测试用例中所有天都使用相同的成本，但初始排列发生变化，因此解决方案必须快速回答许多查询。 

界限`n <= 16`是主要线索。 枚举所有排列是不可能的，因为`16!`是关于`2 * 10^13`。 然而，`n(n-1)/2 <= 120`，因此任何仅取决于反转计数的数量都可以使用小型动态程序进行处理。 天数可达`100000`，这意味着预处理后每个查询必须接近恒定时间。 

微妙之处在于，随机操作并不意味着我们应该模拟随机状态。 随机操作仅贡献一个未知值，即所有排列的平均预期成本。 另一个常见的错误是在没有证明的情况下假设反转操作只能使用一次。 它确实可以减少到至多一个反转，因为两个反转可以一起移动并删除，而它们之间的相邻交换可以进行镜像。 

已经排序的排列有答案`0/1`。 例如，与`n=3`和成本`a=b=c=1`，输入排列`1 2 3`必须产生`0/1`; 将随机操作视为强制操作会给出错误的肯定答案。 

反向操作也会创建边界情况。 为了`n=3`，排列`3 2 1`有 3 个反转，但其反转有 0 个反转。 仅考虑相邻交换的解决方案将返回成本`3a`，而正确的确定性成本可能只是`b`。 

# 方法

 直接的解决方案是将每个排列建模为图节点。 每个节点都具有通过相邻交换和反转获得的状态的边，以及代表随机化的边。 在此图上运行最短路径样式松弛是正确的，但该图包含`n!`节点。 在`n=16`，甚至存储节点也是不可能的。 

关键的观察结果是确定性排序成本仅取决于反转计数。 相邻交换删除或创建一个反转，因此排序无需反转成本`a * inv`。 如果我们使用一次反转，反转计数将从`k`到`m-k`， 在哪里`m=n(n-1)/2`，因为每一对都会从反转变为非反转，或者反之亦然。 因此，最佳的确定性成本是：`min(a*k, b + a*(m-k))`。 

现在考虑随机操作。 让`M`是所有排列的平均预期答案。 随机化的成本是`c+M`，这是一个常数。 如果一个状态的确定性成本是`D`，最优值就是`min(D, c+M)`。 这是有效的，因为如果路径到达的状态的值小于随机化成本，则该路径本身证明原始状态具有较小的确定性解决方案。 

因此我们只需要反转计数的分布。 每个反转计数的排列数可以通过经典的马洪数动态规划找到。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(n!)`状态 |`O(n!)`| 太慢了|
 | 最佳|`O(n^2 + n^3 + d)`每个测试用例|`O(n^2)`| 已接受 |

 # 算法演练

 1. 预先计算多少种长度排列`n`具有所有可能的反转计数。 DP 添加一个新的最大元素并尝试所有可能的位置，这会在`0`和`i-1`新的反转。 
2. 对于每一个可能的反转计数`k`，计算确定性排序成本：`min(a*k, b+a*(m-k))`。 

特定排列的答案只需要其反转计数。 
3. 求解平均随机化值。 让`C=c+M`。 我们需要：`C-c = average(min(C, deterministic_cost))`。 

右侧是分段线性的，因为每个确定性成本都是恒定值。 对可能的确定性成本进行排序并找到包含不动点的区间。 在一个区间内，方程变成一个简单的线性方程。 
4. 对于每个查询排列，使用双循环计算反转次数。 计算其确定性成本和回报`min(C, cost)`作为约简分数。 

为什么有效：排列所需的唯一信息是其反转计数。 相邻交换和全局反转保留了足够的对称性，使得具有相同反转计数的每个排列都具有相同的确定性最优值。 定点计算正确地考虑了最终使用随机操作的可能性，因为每个状态都在其确定性路线和相同的随机重启值之间进行选择。 

# Python 解决方案```python
import sys
from fractions import Fraction

input = sys.stdin.readline

cache_dp = {}

def inversion_counts(n):
    if n in cache_dp:
        return cache_dp[n]
    dp = [1]
    for length in range(1, n + 1):
        ndp = [0] * (len(dp) + length)
        for i, x in enumerate(dp):
            for add in range(length):
                ndp[i + add] += x
        dp = ndp
    cache_dp[n] = dp
    return dp

def solve_average(n, a, b, c):
    counts = inversion_counts(n)
    total = 1
    for i in range(2, n + 1):
        total *= i

    mx = n * (n - 1) // 2
    values = []
    for k, cnt in enumerate(counts):
        values.append((min(a * k, b + a * (mx - k)), cnt))

    grouped = {}
    for v, cnt in values:
        grouped[v] = grouped.get(v, 0) + cnt

    arr = sorted(grouped.items())

    pref_sum = 0
    pref_cnt = 0
    prev = Fraction(0)

    for value, cnt in arr:
        if pref_cnt:
            cand = Fraction(total * c + pref_sum, pref_cnt)
            if cand <= value and cand >= prev:
                return cand
        pref_sum += value * cnt
        pref_cnt += cnt
        prev = Fraction(value)

    return Fraction(total * c + pref_sum, total)

def inv_of_perm(p):
    n = len(p)
    ans = 0
    for i in range(n):
        pi = p[i]
        for j in range(i + 1, n):
            if pi > p[j]:
                ans += 1
    return ans

def solve_case(n, a, b, c, perms):
    C = solve_average(n, a, b, c)
    mx = n * (n - 1) // 2
    out = []

    for p in perms:
        k = inv_of_perm(p)
        det = min(a * k, b + a * (mx - k))
        ans = min(C, Fraction(det))
        out.append(f"{ans.numerator}/{ans.denominator}")
    return out

def main():
    data = sys.stdin.read().strip().splitlines()
    if not data:
        return

    first = list(map(int, data[0].split()))
    idx = 0
    cases = []

    if len(first) == 1:
        z = first[0]
        idx = 1
        for _ in range(z):
            n, a, b, c, d = map(int, data[idx].split())
            idx += 1
            perms = []
            for _ in range(d):
                perms.append(list(map(int, data[idx].split())))
                idx += 1
            cases.append((n, a, b, c, perms))
    else:
        while idx < len(data):
            n, a, b, c, d = map(int, data[idx].split())
            idx += 1
            perms = []
            for _ in range(d):
                perms.append(list(map(int, data[idx].split())))
                idx += 1
            cases.append((n, a, b, c, perms))

    ans = []
    for case in cases:
        ans.extend(solve_case(*case))

    print("\n".join(ans))

if __name__ == "__main__":
    main()
```反转计数动态规划存储马洪数。 这种转变之所以有效，是因为将新的最大士兵插入一个位置会精确地创建已知数量的新反转，并且会考虑每个可能的位置。 

定点求解器对相等的确定性成本进行分组，而不是迭代所有排列。 最多有`121`反转很重要，所以这部分保持很小。`Fraction`仅在求解全局期望时使用，当所需输出是精确有理数时，可以避免精度误差。 

查询部分故意不使用DP表。 该表仅给出所有排列的频率。 对于实际的排列，我们需要其精确的反转计数，并且`n=16`使二次计数方法足够快`100000`查询。 

# 工作示例

 对于排序后的排列：

 | 排列| 倒置| 确定性成本| 最终值|
 | ---| ---| ---| ---|
 |`1 2 3 4 5 6`| 0 | 0 |`0/1`|

 反转次数已经很少，因此不需要任何操作。 

对于排列`5 4 3 2 1 6`:

 | 排列| 倒置| 反向反转| 确定性选择|
 | ---| ---| ---| ---|
 |`5 4 3 2 1 6`| 10 | 10 5 |`min(10a, b+5a)`|

 随着样品成本`a=b=c=1`，确定性成本是`6`。 随机选项的成本更高，所以结果是`6/1`。 

# 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(n^3 + d*n^2)`| 预处理很小，因为最大反转计数为 120，并且每个查询都会计算反转 |
 | 空间|`O(n^2)`| 仅存储逆分布和小辅助数组 |

 最大可能`n`仅给出 121 个反转计数状态。 主要工作是处理输入排列，这是可行的，因为`16^2 * 100000`对比还是很小的。 

# 测试用例```
# The implementation above can be tested with these inputs.

# Sample
sample = """6 1 1 1 3
1 2 3 4 5 6
5 4 3 2 1 6
6 4 2 1 3 5
"""

# Expected:
# 0/1
# 6/1
# 2771/428
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`n=2`, 排序排列 |`0/1`| 已解决状态 |
 |`n=2`, 逆排列 | 最少一次掉期和一次逆转 | 反转边界|
 |`n=16`，随机排列| 有限分数| 最大尺寸处理|
 | 相同的成本值`a=b=c=1`| 精确有理输出 | 定点计算 |

 # 边缘情况

 已求解的排列的反转计数为零。 确定性成本变为零，因此算法在随机化值发挥作用之前返回零。 

完全反转的排列具有反转计数`m`。 逆运算将其变为零反转，因此公式选择`b`而不是支付所有相邻的掉期费用。 

随机化有吸引力的情况由固定点处理。 如果每个确定性选项都很昂贵，则计算出的`C`变得小于这些成本，并且每个这样的排列首先正确地使用随机操作。 该方程是全局求解的，因此所有排列都具有相同的重启期望。
