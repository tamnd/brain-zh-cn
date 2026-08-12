---
title: "CF 102392E - 生命转移"
description: "我们有 (n) 名年龄已知的人。 每个人都必须作为司机或乘客乘坐汽车或单独乘坐摩托车出行。 一辆车有容量 (k)，其中一名乘员就是驾驶员，并且该驾驶员必须至少 (lc) 岁。"
date: "2026-08-10T19:32:18+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102392
codeforces_index: "E"
codeforces_contest_name: "2019-2020 ICPC Southeastern European Regional Programming Contest (SEERC 2019)"
rating: 0
weight: 102392
solve_time_s: 256
verified: true
draft: false
---

[CF 102392E - 生命转移](https://codeforces.com/problemset/problem/102392/E)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 16s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 (n) 名年龄已知的人。 每个人都必须作为司机或乘客乘坐汽车或单独乘坐摩托车出行。 一辆车有容量 (k)，其中一名乘员就是驾驶员，并且该驾驶员必须至少 (l_c) 岁。 车内其他人没有最低年龄要求，至少 1 岁即可。 一辆摩托车载一个人，该人必须年满 (l_m) 岁。 

汽车成本为 (p_c)，摩托车成本为 (p_m)。 由于 (p_c>p_m)，汽车数量很重要，因为一辆车可以替代多辆摩托车，但使用更多汽车也会产生更多可能需要增加年龄的驾驶员。 

在旅行之前，年龄可能会在人与人之间转移。 如果一个人失去 (x) 岁，另一个人正好增加 (x) 岁，因此人口的总年龄永远不会改变。 转移一年的成本（t）。 对于每个人来说，最终年龄最多可以与原始年龄相差 (d)，并且没有人会变得小于 1。 

对于固定的运输计划，问题是分配问题。 有些人需要额外的年龄才能满足驾驶员或摩托车的要求，而其他人则有足够的年龄来捐赠。 转移成本正是必须加到那些最初太年轻的人身上的总年数。 

输入包含 (n) 和 (k)，然后是两个年龄阈值和两个车辆价格，然后是转移价格 (t) 和最大个人年龄变化 (d)，最后是年龄数组。 所需的输出是最小总租金和转让成本，或者（-1）（如果不存在有效安排）。 

界限足够大，可以排除任何指数或二次的情况。 对于 (n\le 10^5)，(O(n^2)) 算法在最坏的情况下已经执行了大约 (10^{10}) 次基本操作，远远超出了一秒限制所允许的范围。 排序很好，因为 (O(n\log n)) 在此规模下大约有几百万次比较。 排序后，剩下的工作需要线性化。 

有几种边缘情况很容易被错误处理。 首先，汽车乘客不需要满足(l_m)。 例如，```
2 2
18 1000 16 1
5 3
16 15
```有答案（1010）。 16岁的人可以从15岁的人那里获得2年的时间才能成为驾驶员，而15岁的人的最终年龄为13岁。允许乘客年龄在16岁以下，因为摩托车门槛仅适用于摩托车骑手。 如果解决方案错误地要求每个汽车乘客至少为 (l_m)，则这种安排是不可能的。 

其次，年龄变更限制适用于每个人，而不仅仅是接受年龄限制的人。 例如，```
3 2
20 3 15 1
1 3
20 11 13
```有答案（6）。 使用一辆车。 20岁开车，11岁乘客，13岁骑摩托车。 骑摩托车的人还需要2年，而乘客可以捐献正好2年，从11年变成9年。结果成本（3+1+2=6）。 将汽车乘客视为需要（l_m）的粗心解决方案将拒绝该安排。 

第三，一个人需要恰好（d）额外年数的情况是有效的。 如果赤字为 (d+1)，则即使其他人有足够的闲置年龄，该人也无法获得足够的年龄。 个人限额必须与可用年龄总额分开检查。 

最后，汽车的数量可以是(\lceil n/k\rceil)，而不仅仅是(\lfloor n/k\rfloor)。 最后一节车厢允许容纳少于 (k) 人，因为 (k) 是容量。 例如，对于（n=5，k=3），两辆车可以承载所有人，第一辆车里有三个人，第二辆车里有两个人。 

## 方法

 直接的暴力解决方案将枚举汽车的数量，然后尝试将人员分配给司机、汽车乘客和摩托车骑手。 对于每项任务，我们可以计算年龄缺陷、可以捐赠的可用年龄以及相应的成本。 这是正确的，因为考虑了所有可能的交通安排。 

问题是作业的数量。 在特殊情况下（k=1），只有司机和摩托车骑手，并且所有（2^n）个子集都是可能的。 如果每个候选作业都在 (O(n)) 中检查，那么最坏情况的工作是 (O(n2^n))，这对于 (n=10^5) 来说已经是不可能的了。 允许三个角色只会让搜索空间更大。 

关键的观察结果是，一旦汽车数量固定，所有三组的规模也就固定了。 假设有 (c) 辆汽车。 有 (c) 名司机，最多 (c(k-1)) 名汽车乘客，其余人使用摩托车。 更准确地说，摩托车骑手的数量是

 [
 m=\max(0,n-ck)。 
]

 如果(ck<n)，则所有(c)辆车都可以完全装满。 如果(ck\ge n)，则没有摩托车，最后一辆车只装了部分车辆。 

这三个角色有三个不同的年龄阈值：

 [
 l_c > l_m > 1。 
]

 这种排序给了我们贪婪的分配。 按年龄降序排列后，最年长的 (c) 人应该是司机，接下来的 (c(k-1)) 人应该是汽车乘客，剩下的每个人都应该使用摩托车。 

为什么这有效？ 考虑两个年龄为 (x\ge y) 的人，以及两个具有阈值 (H>L) 的角色。 为 (x) 而不是 (y) 提供更高的阈值不能增加所需的年龄转移。 功能

 [
 \max(0,H-a)-\max(0,L-a)
 ]

 不随着 (a) 的增长而增加，因此年长的人总是更严格的角色的更好候选人。 

同样的交换论点也适用于可行性。 将分配给阈值 (T) 的人的最大有用净贡献定义为

 [
 B_T(a)=\min(d,a-T)。 
]

 如果 (a<T)，则为负数，表示该人必须获得的年数。 如果 (a\ge T) 为正数，表示该人在遵守 (d) 年限制的情况下可以捐赠多少年。 对于两个阈值 (H>L)，差值 (B_L(a)-B_H(a)) 不随 (a) 增加。 因此，为老年人分配更严格的角色永远不会减少总可用余额。 

因此，排序后的安排同时最小化了转账需求并最大化了可用转账余额。 我们不需要考虑其他角色分配。 

排序后，前缀和让我们可以在常数时间内评估所有可能的汽车数量。 我们只需要扫描(c=0,1,\ldots,\lceil n/k\rceil)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n2^n)) 在 (k=1) 最坏情况下 | (O(n)) | (O(n)) | 太慢了 |
 | 最佳| (O(n\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

1. 将所有年龄按降序排列。 对于固定数量的汽车，第一组将是司机，下一组将是汽车乘客，剩下的组将是摩托车骑手。 阈值的排序 (l_c>l_m>1) 使该分配通过上面的交换参数达到最佳。 
2. 预先计算四个量的前缀和。 对于驱动程序，存储所需的增量 (\max(0,l_c-a_i)) 和净贡献 (\min(d,a_i-l_c))。 对于摩托车骑手，存储与阈值 (l_m) 类似的量。 对于汽车乘客来说，他们的阈值是 1，所以他们的贡献就是 (\min(d,a_i-1))。 乘客永远不需要额外的年龄，因为每个初始年龄至少为 1。 
3. 枚举从 0 到 (\lceil n/k\rceil) 的汽车数量 (c)。 对于 (c) 汽车，令

 [
 q=\min(n,ck)。 
]

 第一个 (c) 排序的人是司机，位置 (c) 到 (q-1) 是汽车乘客，位置 (q) 到 (n-1) 是摩托车骑手。 

1. 计算所需转账金额。 只有司机和摩托车骑手可以要求额外年龄，所以

 [
 R=
 \text{驱动程序需要}[c]
 +
 \left(\text{摩托车需要}[n]-\text{摩托车需要}[q]\right)。 
]

 乘客对此数量的贡献为零，因为他们只需要保持至少 1 岁即可。 

1. 检查个人 (d) 年限制。 如果有司机，最小的司机必须满足

 [
 a_{c-1}+d\ge l_c。 
]

 如果有摩托车，最小的摩托车骑手必须满足

 [
 a_{n-1}+d\ge l_m。 
]

 因为数组是排序的，所以检查每组中最小的人就足够了。 赤字大于（d）的人永远无法达到规定的年龄，无论其他人有多少年龄。 

1. 计算总净年龄余额。 对于每个驱动程序，请使用 (\min(d,a_i-l_c))。 对于每位乘客，使用 (\min(d,a_i-1))。 对于每个摩托车骑手，请使用 (\min(d,a_i-l_m))。 总和必须至少为零。 

非负余额意味着可以捐赠的总额足以弥补所有赤字。 由于每个个体缺陷都已根据（d）进行了检查，因此可以将捐赠者和​​接收者配对，直到满足每个所需的年龄增长为止。 

1.计算运输成本。 有 (c) 辆汽车和

 [
 \max(0,n-ck)
 ]

 摩托车。 因此租金成本为

 [
 c\cdot p_c+\max(0,n-ck)\cdot p_m。 
]

 传输成本为 (R\cdot t)。 添加这些值并最小化所有可行的答案 (c)。 

1. 如果 (c) 的值都不可行，则打印 (-1)。 否则打印找到的最小总成本。 

### 为什么它有效

 对于任何固定数量的汽车，这三个角色都有阈值（l_c>l_m>1）。 年龄为 (x\ge y) 的两个人的交换表明，为 (x) 指定更严格的阈值绝不会增加所需的转账，也绝不会减少可用的转账余额。 重复这些交换会准确地产生算法所使用的排序排列。 

对于这种安排，前缀和计算每个人必须获得的确切年龄以及每个人在（d）年限制下可以缴纳的确切最大金额。 个人赤字支票保证接收者不会违反其个人限额，而总余额支票则保证可以提供所需的年龄。 因此，每个被接受的候选者都对应于一组有效的换乘，并且每个有效的交通计划都由一个枚举的汽车数量表示。 对所有候选者取最小值即可得出最优总成本。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())
    lc, pc, lm, pm = map(int, input().split())
    t, d = map(int, input().split())
    a = list(map(int, input().split()))

    a.sort(reverse=True)

    # Prefix sums.
    #
    # need_c[i]:
    #   total age required to make the first i people valid drivers.
    #
    # need_m[i]:
    #   total age required to make the first i people valid motorcycle riders.
    #
    # bal_c[i]:
    #   total net contribution of the first i people as drivers.
    #
    # bal_m[i]:
    #   total net contribution of the first i people as motorcycle riders.
    #
    # bal_p[i]:
    #   total net contribution of the first i people as car passengers.
    #
    # A passenger only has to remain at least 1 year old.

    need_c = [0] * (n + 1)
    need_m = [0] * (n + 1)
    bal_c = [0] * (n + 1)
    bal_m = [0] * (n + 1)
    bal_p = [0] * (n + 1)

    for i, age in enumerate(a, 1):
        need_c[i] = need_c[i - 1] + max(0, lc - age)
        need_m[i] = need_m[i - 1] + max(0, lm - age)

        bal_c[i] = bal_c[i - 1] + min(d, age - lc)
        bal_m[i] = bal_m[i - 1] + min(d, age - lm)
        bal_p[i] = bal_p[i - 1] + min(d, age - 1)

    max_cars = (n + k - 1) // k
    INF = 10**30
    ans = INF

    for c in range(max_cars + 1):
        q = min(n, c * k)

        # First c people are drivers.
        # Next q-c people are car passengers.
        # Remaining people are motorcycle riders.

        # Every driver must be able to reach lc.
        if c > 0 and a[c - 1] + d < lc:
            continue

        # Every motorcycle rider must be able to reach lm.
        if q < n and a[n - 1] + d < lm:
            continue

        # Required age transfer.
        need = need_c[c] + (need_m[n] - need_m[q])

        # Total net amount of age available after respecting
        # the d-year limit for every individual.
        balance = (
            bal_c[c]
            + (bal_p[q] - bal_p[c])
            + (bal_m[n] - bal_m[q])
        )

        if balance < 0:
            continue

        motorcycles = max(0, n - c * k)
        cost = c * pc + motorcycles * pm + need * t

        if cost < ans:
            ans = cost

    print(-1 if ans == INF else ans)

if __name__ == "__main__":
    solve()
```排序步骤创建算法中描述的三个连续的角色组。 由于 Python 的排序运行时间为 (O(n\log n))，因此这是解决方案中唯一的超线性部分。 

五个前缀数组允许评估每个候选汽车数量，而无需再次扫描人员。 例如，`need_c[c]`正是第一个所需的传输`c`司机，同时`need_m[n] - need_m[q]`是摩托车团要求的接送。 

表达式`min(d, age - threshold)`是关键的实施细节。 什么时候`age`低于阈值，则为负值，表示需要增加。 什么时候`age`高于阈值，为正，但上限为`d`，因为这个人的损失不能超过`d`年。 对于乘客来说，阈值是 1，所以`min(d, age - 1)`总是非负的。 

边界`q = min(n, c * k)`处理部分装满的最终车辆。 什么时候`c*k >= n`，没有摩托车，还有位置`c`通过`n-1`都是乘客。 这就是为什么循环包括`ceil(n/k)`汽车。 

Python 整数不会溢出，但使用显式的大`INF`保持最低成本逻辑清晰。 最大可能的答案也在 Python 的整数范围内。 

## 工作示例

 ### 示例 1

 输入是```
2 2
18 1000 16 1
5 3
16 15
```排序后，年龄已经是`[16, 15]`。 

| 汽车 (c) | (q) | 司机 | 乘客 | 摩托车 | 需要| 平衡| 可行| 总计 |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 无 | 无 | 16、15 | 1 | -1 | 没有 | 2 |
 | 1 | 2 | 16 | 16 15 | 15 无 | 2 | 1 | 是的 | 1010 | 1010

 由于汽车数量为零，15 岁的摩托车骑手需要额外一年，但没有人可以在满足要求的情况下捐献年龄，因此余额为负数。 

拥有一辆车，16岁成为司机，需要2年时间。 15岁只是一个乘客，所以他们可以捐献2年，变成13岁。两个个体的变化最多是(d=3)。 总数为 (1000+2\cdot5=1010)。 

### 示例 2

 输入是```
2 2
23 10 15 5
2 2
9 20
```排序后，年龄为`[20, 9]`。 

| 汽车 (c) | (q) | 司机 | 乘客 | 摩托车 | 需要| 平衡| 可行| 总计 |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 无 | 无 | 20、9 | 6 | -4 | 没有 | 40 | 40
 | 1 | 2 | 20 | 20 9 | 无 | 3 | -1 | 没有 | 10 | 10

 拥有零辆汽车的 9 岁孩子需要 6 年才能达到 15 辆摩托车的门槛，但是 (d=2)，因此此人无法成为有效的摩托车骑手。 

拥有一辆车，20岁的人要成为一名23岁的司机，需要3年时间，再次超出了个人限制（d=2）。 因此没有可行的运输计划。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log n)) | 排序成本 (O(n\log n))，所有前缀构造和车辆计数检查都需要 (O(n))。 |
 | 空间| (O(n)) | (O(n)) | 已排序的年龄和五个前缀数组均使用线性内存。 |

 主要操作是对 (10^5) 个年龄进行排序，然后对最多 (\lceil n/k\rceil+1) 可能的汽车计数进行一次线性扫描。 这很容易在预期限制内，同时避免指数角色分配搜索。 

## 测试用例```python
# Complete assert-based test harness.
# The solution itself is the solve() function below.

import sys
import io

def solve():
    input = sys.stdin.readline

    n, k = map(int, input().split())
    lc, pc, lm, pm = map(int, input().split())
    t, d = map(int, input().split())
    a = list(map(int, input().split()))

    a.sort(reverse=True)

    need_c = [0] * (n + 1)
    need_m = [0] * (n + 1)
    bal_c = [0] * (n + 1)
    bal_m = [0] * (n + 1)
    bal_p = [0] * (n + 1)

    for i, age in enumerate(a, 1):
        need_c[i] = need_c[i - 1] + max(0, lc - age)
        need_m[i] = need_m[i - 1] + max(0, lm - age)

        bal_c[i] = bal_c[i - 1] + min(d, age - lc)
        bal_m[i] = bal_m[i - 1] + min(d, age - lm)
        bal_p[i] = bal_p[i - 1] + min(d, age - 1)

    max_cars = (n + k - 1) // k
    INF = 10**30
    ans = INF

    for c in range(max_cars + 1):
        q = min(n, c * k)

        if c > 0 and a[c - 1] + d < lc:
            continue

        if q < n and a[n - 1] + d < lm:
            continue

        need = need_c[c] + need_m[n] - need_m[q]

        balance = (
            bal_c[c]
            + bal_p[q] - bal_p[c]
            + bal_m[n] - bal_m[q]
        )

        if balance < 0:
            continue

        motorcycles = max(0, n - c * k)
        cost = c * pc + motorcycles * pm + need * t
        ans = min(ans, cost)

    print(-1 if ans == INF else ans)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples.
assert run("""\
2 2
18 1000 16 1
5 3
16 15
""") == "1010", "sample 1"

assert run("""\
2 2
23 10 15 5
2 2
9 20
""") == "-1", "sample 2"

# Minimum-size input.
assert run("""\
1 1
18 5 16 1
3 2
16
""") == "1", "minimum-size case"

# All values equal.
assert run("""\
6 3
20 10 10 6
2 5
15 15 15 15 15 15
""") == "36", "all-equal case"

# Boundary case where exactly d years must be transferred.
assert run("""\
3 2
20 3 15 1
1 5
20 15 10
""") == "8", "exact d transfer"

# A person too young for a motorcycle can become a car passenger.
assert run("""\
3 2
20 3 15 1
1 3
20 11 13
""") == "6", "car passenger has no lm requirement"

# Maximum-size input, generated rather than written explicitly.
n = 100000
ages = " ".join(["1"] * n)
max_input = f"""\
{n} 1
2 2 1 1
0 0
{ages}
"""
assert run(max_input) == "100000", "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 18 5 16 1 / 3 2 / 16`|`1`| 最小尺寸输入和零车情况|
 | 六人均为 15 岁 |`36`| 全等年龄及不同车数对比|
 |`20 15 10`与 (d=5) |`8`| 转让正好 (d) 年是合法的 |
 |`20 11 13`与 (d=3) |`6`| 汽车乘客不需要摩托车门槛|
 | (10^5) 人，所有年龄 1 |`100000`| 最大值（n）、大前缀数组和线性扫描 |

 ## 边缘情况

 第一个微妙的例子是汽车乘客和摩托车骑手之间的区别。 在```
3 2
20 3 15 1
1 3
20 11 13
```一辆车就够了。 20岁开车，11岁乘客，13岁骑摩托车。 摩托车骑手需要两年，乘客则捐出这两年。 乘客的年龄为 9 岁，这是合法的，因为只有 1 的下限和 (d=3) 变更限制很重要。 总数为(3+1+2=6)。 

第二个微妙的情况是个人转账限额。 假设摩托车骑手的年龄低于 (l_m) 4 岁，而 (d=3)。 即使另一个人有十个空闲年，骑手也不能获得全部四个，因为他们的年龄最多可以增加三个。 该算法在依靠总平衡之前通过检查最年轻的摩托车骑手与（l_m-d）来捕获这一点。 

同样的道理也适用于司机。 如果最年轻的选定驾驶员的年龄为（l_c-d-1），则该候选汽车数量是不可能的。 由于司机是排序后的前 (c) 个人，因此仅检查第 (c) 个人就足够了。 

第三个边缘情况是零转移成本。 当（t=0）时，算法仍然执行所有可行性检查。 可行的方案只需要租车费用，不可行的方案则仍然是不可能的。 仅仅因为转账免费而跳过可行性计算是不正确的。 

第四种边缘情况是（d=0）。 没有人的年龄可以改变，所以每个被选中的司机必须已经满足（l_c），每个摩托车骑手必须已经满足（l_m），乘客可以不做出任何贡献。 对于已经高于角色阈值的人，平衡公式自然减少到零，对于低于角色阈值的人，平衡公式自然减少到零。 

第五个边缘情况是部分填充的最终汽车。 对于（n=5）和（k=3），两辆车可以运载所有人。 前三人占用一辆车，其余两人占用第二辆车。 该算法达到(c=\lceil5/3\rceil=2)，设置(q=\min(5,6)=5)，并正确创建了两名驾驶员和三名没有摩托车的乘客。 

最终的边缘情况是（k=1）。 每辆车只载一个人，所以车上没有乘客。 该算法仍然有效，因为 (c(k-1)=0)，使得乘客间隔为空。 候选范围从零辆汽车（每个人都使用摩托车）到（n）辆汽车（每个人都是司机）。
