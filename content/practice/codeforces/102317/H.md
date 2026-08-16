---
title: "CF 102317H - 计算可分割的对"
description: "我们有一个最多包含 (p) 个整数的列表，并且每个有序位置对 ((i,j)) 都是候选者。 当 (Ai) 是 (Aj) 的真因数时，即对 (Aj) 进行计数，即 (Aj) 是 (Ai) 的整数倍，但两个值不相等。"
date: "2026-08-16T19:02:22+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102317
codeforces_index: "H"
codeforces_contest_name: "UCF Locals 2016"
rating: 0
weight: 102317
solve_time_s: 449
verified: true
draft: false
---

[CF 102317H - 计算可分割的对](https://codeforces.com/problemset/problem/102317/H)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 29s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个最多包含 (p) 个整数的列表，并且每个有序位置对 ((i,j)) 都是候选者。 当 (A_i) 是 (A_j) 的真因数时，即对 (A_j) 进行计数，即 (A_j) 是 (A_i) 的整数倍，但两个值不相等。 即使该值出现多次，相等的值也永远不会形成正确的分隔对。 输入值的范围从(0)到(10^7)，而(p)可以达到(10^6)。 官方声明还给出了零的特殊规则：零不能整除任何东西，而每个非零整数都是零的真约数。 

输出是满足该条件的有序索引对的数量。 重数很重要，因此如果值 (2) 出现 3 次且 (6) 出现两次，则这些出现将与除数 (2) 和被除数 (6) 贡献 (3\cdot2=6) 对。 官方的格式是`Test case #t: m`，后跟一个空行。 

主要约束改变了解的形状。 对于 (p=10^6)，检查每个有序对在最坏的情况下将需要 (10^{12}) 整除性测试，这远远超出了五秒的限制。 不过，这些值仅受 (10^7) 限制，并且该有界值范围正是让我们用倍数筛替换对枚举的原因。 比赛的时间为 5 秒和 256 MB，因此预期的方法需要利用值界限而不是对的数量。 

有几种边缘情况可能会悄悄地破坏原本合理的实现。 

考虑```
1
2
1 1
```答案是`0`。 虽然 (1) 整除 (1)，但真因数必须不同于它所除的数。 仅检查的解决方案`N % D == 0`会错误地计算两个有序对。 

考虑```
1
2
0 5
```答案是`1`，因为 ((5,0)) 是真分割对。 ((0,5)) 对无效，因为零不是任何数字的约数。 一个简单测试的解决方案`N % D == 0`甚至无法安全地评估零除数的情况。 

考虑```
1
4
1 2 2 4
```答案是`5`。 (2) 的两个副本是不同的元素，因此每个都可以作为 (4) 的除数，得到两对。 值 (1) 除以 (2) 和 (4) 的两个副本，得到另外三个副本。 将输入视为一个集合而不是多重集会丢失这些多重性。 

## 方法

 直接的方法是检查每个有序的位置对。 对于每一对 ((i,j))，我们检查 (A_i) 是否非零、(A_i\neq A_j) 是否以及 (A_j) 是否可被 (A_i) 整除。 这是正确的，因为它将定义直接应用于每个可能的对。 问题是 (O(p^2)) 检查次数。 在 (p=10^6) 时，最坏的情况包含 (10^{12}) 个有序对，因此即使非常便宜的整除性测试也无法使这种方法可行。 

有用的观察是条件仅取决于值，而不取决于位置。 假设正值 (d) 出现 (freq[d]) 次。 输入中出现的每个正倍数 (2d,3d,\ldots) 都可以是它的被除数。 如果 (m) 是这样的倍数，则 (d) 的每次出现都与 (m) 的每次出现配对，从而贡献

 [
 频率[d]\c点频率[m]。 
]

 我们可以通过固定除数值 (d) 并遍历其倍数来计算这些贡献。 值 (d) 本身被故意跳过，因为相等是被禁止的。 

零可以单独处理。 每个正输入值都是零的真因数，所以如果`zero_count`是零的数量并且`positive_count`是正元素的数量，零正好贡献

 [
 正计数\cdot 零计数。 
]

 零本身作为除数没有任何贡献。 

蛮力方法之所以有效，是因为它明确地考虑了每一对，但由于对太多而失败。 固定正除数的所有可能被除数都是其倍数的观察结果让我们首先聚合相等的值，并枚举有界值域上的整除关系。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(p^2)) | (O(p^2)) | (O(1)) 除了输入 | 太慢了 |
 | 倍数筛| (O(M\log M)) 在整个值范围内，其中 (M\le10^7) | (O(M)) | 已接受 |

 这里（M）是测试用例中实际出现的最大值。 由于 (p\le10^6)，实际上最多可以出现 (10^6) 个不同的正值，因此访问的倍数数量通常大大小于理论 (M\log M) 界限。 

## 算法演练

 1. 读取 (p) 值并找到最大值 (M)。 我们只需要最多 (M) 的频率信息，因此当实际最大值较小时，无需分配最多固定上限 (10^7) 的空间。 
2.构建频率数组`freq`， 在哪里`freq[x]`是值 (x) 出现的次数。 数组比字典更可取，因为该算法以精确倍数重复访问频率，并且值范围是有界的。 
3. 单独计数零。 零永远不能成为有效对中的除数，但每个正值都可以是每个零的除数。 
4. 初始化答案`positive_count * zero_count`。 这说明了每对股息为零且除数为正的货币对。 
5. 对于输入中出现的每个正值 (d)，遍历`2*d, 3*d, ...`而倍数最多为(M)。 这些正是 (d) 除的正值，并且与 (d) 不同。 
6. 对于每个倍数 (m)，添加`freq[d] * freq[m]`到答案。 第一个因素选择除数的出现，第二个因素选择被除数的出现。 开始于`2*d`而不是`d`自动排除相等的值。 
7. 以所需的测试用例格式打印累积答案并添加所需的空行。 

关键的不变量是，处理除数值 (d) 后，除数值为 (d) 且被除数为正的每个有效对都被精确计数一次。 当外循环到达 (d) 时才进行计数，因为每个正整除值都出现在倍数循环中，并且两个频率的乘积会计算它们出现的每个组合。 不计算具有相等值的对，因为倍数循环从 (2d) 开始，并且不计算涉及零作为除数的对，因为外循环从 (1) 开始。 单独的零贡献说明了涉及零的每个剩余有效对。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve_case(a):
    n = len(a)
    mx = max(a)

    zero_count = 0
    for x in a:
        if x == 0:
            zero_count += 1

    positive_count = n - zero_count

    # An unsigned 32-bit integer is enough because n <= 10^6.
    freq = array('I', [0]) * (mx + 1)

    for x in a:
        freq[x] += 1

    # Every positive number is a proper divisor of zero.
    ans = positive_count * zero_count

    # For each divisor d, inspect only its proper positive multiples.
    for d in range(1, mx + 1):
        cd = freq[d]
        if cd == 0:
            continue

        for m in range(d + d, mx + 1, d):
            cm = freq[m]
            if cm:
                ans += cd * cm

    return ans

def main():
    t = int(input())
    out = []

    for tc in range(1, t + 1):
        p = int(input())

        a = []
        while len(a) < p:
            a.extend(map(int, input().split()))

        ans = solve_case(a)
        out.append(f"Test case #{tc}: {ans}")
        out.append("")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```这`solve_case`函数首先确定实际的最大值，这使频率数组尽可能小。 最大值为 (10^7)，无符号 32 位条目就足够了，因为每个频率最多为 (10^6)。 这`array`模块避免了存储数百万个 Python 整数对象的更大内存成本。 

零贡献是在倍数循环之前计算的。 如果有`positive_count`积极的元素和`zero_count`零，每个正元素可以占据除数位置，而每个零可以占据被除数位置，产生它们的笛卡尔积。 

主循环开始于`d + d`。 这种单一边界选择可以处理真除数限制，而不需要单独的相等检查。 开始于`d`并添加`freq[d] * freq[d]`是错误的，因为相等的值不是正确的除法对。 

乘法使用Python整数，因此不存在溢出问题。 在固定宽度整数的语言中，64位类型是必要的，因为有效有序对的数量可以达到(p^2)量级，可以达到(10^{12})。 

输入读取器允许 (p) 值跨越多个物理行，即使官方格式将它们呈现为一行。 这使得解析器在不改变算法的情况下变得健壮。 

## 工作示例

 官方问题存档描述了示例部分，但通过竞赛存档提供的提取语句不会公开示例输入和输出值本身。 因此构造以下两个例子来直观地展示重要案例。 

考虑```
1
4
1 2 2 4
```频率状态为`freq[1] = 1`,`freq[2] = 2`， 和`freq[4] = 1`。 没有零。 

| 除数`d`|`freq[d]`| 多次访问 | 添加贡献 | 运行答案|
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 2, 4 | (1\cdot2 + 1\cdot1 = 3) | 3 |
 | 2 | 2 | 4 | (2\cdot1 = 2) | 5 |
 | 4 | 1 | 无 | 0 | 5 |

 除数(1)贡献的三对是(2)出现两次和(4)出现一次。 (2) 的两次出现分别除以 (4) 的出现，得到另外两个。 最终输出是`Test case #1: 5`。 

现在考虑```
1
3
0 5 10
```有一个零和两个正值。 零贡献已经是 (2)，因为 (5) 和 (10) 都是零的真因数。 

| 除数`d`|`freq[d]`| 多次访问 | 添加贡献 | 运行答案|
 | ---| ---| ---| ---| ---|
 | 1 | 0 | 无 | 0 | 2 |
 | 5 | 1 | 10 | 10 (1\cdot1 = 1) | 3 |
 | 10 | 10 1 | 无 | 0 | 3 |

 最终的答案是`3`。 这三对是 ((5,0))、((10,0)) 和 ((5,10))。 零永远不会作为除数出现。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(M\log M)) 最坏情况 | 对于除数(d)，最多检查(M/d-1)倍数，调和和为(O(M\log M))。 |
 | 空间| (O(M)) | 频率数组为从 (0) 到 (M) 的每个值存储一个 32 位计数。 |

 最大值为 (10^7)，而输入元素的数量最多为 (10^6)。 有界值范围使得多重筛选可行，而 (O(p^2)) 对枚举最多需要 (10^{12}) 个检查。 竞赛内存限制为 256 MB，Python 实现使用紧凑的 32 位频率数组，而不是 Python 整数对象列表。 

## 测试用例```python
# helper: run the solution on an input string
import io
import sys
from array import array

def solve_case(a):
    n = len(a)
    mx = max(a)

    zero_count = 0
    for x in a:
        if x == 0:
            zero_count += 1

    positive_count = n - zero_count

    freq = array('I', [0]) * (mx + 1)

    for x in a:
        freq[x] += 1

    ans = positive_count * zero_count

    for d in range(1, mx + 1):
        cd = freq[d]
        if cd == 0:
            continue

        for m in range(d + d, mx + 1, d):
            cm = freq[m]
            if cm:
                ans += cd * cm

    return ans

def run(inp: str) -> str:
    old_stdin = sys.stdin
    try:
        sys.stdin = io.StringIO(inp)

        t = int(sys.stdin.readline())
        out = []

        for tc in range(1, t + 1):
            p = int(sys.stdin.readline())

            a = []
            while len(a) < p:
                a.extend(map(int, sys.stdin.readline().split()))

            out.append(f"Test case #{tc}: {solve_case(a)}")
            out.append("")

        return "\n".join(out)
    finally:
        sys.stdin = old_stdin

# Minimum-size input. 1 divides 0, so there is one valid pair.
assert run("1\n2\n0 1\n") == "Test case #1: 1\n", "minimum size"

# All values equal. Divisibility alone is not enough because equal values
# cannot form proper dividing pairs.
assert run("1\n4\n7 7 7 7\n") == "Test case #1: 0\n", "all equal"

# Duplicates must be counted by occurrence.
# 1 divides both 2s and 4: 3 pairs.
# Each of the two 2s divides 4: 2 pairs.
assert run("1\n4\n1 2 2 4\n") == "Test case #1: 5\n", "duplicates"

# Zero boundary case.
# 5 and 10 divide 0, and 5 divides 10.
assert run("1\n3\n0 5 10\n") == "Test case #1: 3\n", "zero handling"

# Maximum value boundary.
# Two copies of 10^7 are both proper divisors of zero.
assert run("1\n3\n10000000 10000000 0\n") == "Test case #1: 2\n", "maximum value"

# Maximum-size input, with all values equal.
# There are 10^6 equal values, but none can divide another properly.
max_n = 10**6
max_input = "1\n" + str(max_n) + "\n" + ("1 " * max_n)
assert run(max_input) == "Test case #1: 0\n", "maximum size"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 / 0 1`|`Test case #1: 1`| 最小尺寸和特殊零规则 |
 |`4 / 7 7 7 7`|`Test case #1: 0`| 不得计算相同的值 |
 |`4 / 1 2 2 4`|`Test case #1: 5`| 重复出现的情况独立贡献 |
 |`3 / 0 5 10`|`Test case #1: 3`| 零作为股息和普通整除 |
 |`3 / 10000000 10000000 0`|`Test case #1: 2`| 最大值边界和重复最大值 |
 | (10^6) 份`1`|`Test case #1: 0`| 最大输入大小以及 (p)（而不是不同值的数量）控制多重性的事实 |

 ## 边缘情况

 对于相等的值，请考虑```
1
2
1 1
```频率数组包含`freq[1] = 2`。 外层循环到达 (d=1)，但其倍数循环从 (2) 开始，因此没有正倍数可供检查。 零计数也为零，使答案为零。 这直接强制执行严格条件 (D\neq N)。 

对于零作为除数，考虑```
1
2
0 5
```正计数为 1，零计数为 1，因此初始答案为 (1\cdot1=1)。 倍数循环从不处理 (d=0)，正确地避免了零除另一个值的无效想法。 结果是`Test case #1: 1`。 

对于零股息，请考虑```
1
3
0 5 10
```初始零贡献是 (2)，占 ((5,0)) 和 ((10,0))。 然后除数 (5) 找到 (10) 作为真正倍数并再加一对。 结果是三。 这个案例说明了为什么不能简单地忽略零。 

对于重复项，请考虑```
1
4
1 2 2 4
```当(d=1)时，`freq[1]`是一，`freq[2]`是二，并且`freq[4]`是一，所以贡献是三。 当(d=2)时，其频率为2，其真倍数(4)的频率为1，因此又添加了两对。 答案是五。 该算法精确地处理频率，因为每次出现的除数都可以与每次出现的被除数配对。 

对于最大可能值，请考虑```
1
3
10000000 10000000 0
```(10^7) 的两个副本都是零的真因数，形成两对。 由于在允许的值范围内不存在更大的正倍数，因此 (10^7) 的倍数循环不执行迭代。 (10^7) 的等份副本不计算在内。 结果是`Test case #1: 2`。 

对于最大输入大小，一种有用的压力情况是相同值的一百万个副本：```
1
1000000
1 1 1 1 ...
```没有零，唯一不同的除数值是 (1)。 它的倍数从 (2) 开始，其频率为零，因此答案仍然为零。 更一般地说，这种情况说明了为什么算法取决于其实际倍数工作的不同值的数量，同时仍然正确保留所有一百万个输入元素的重数。
