---
title: "CF 102394F - 固定横幅"
description: "我们正好有六幅旧横幅。 从每个横幅中，我们必须恰好选择一个字符，总共正好有六个字符。 这六个字我们可以随意重新排序，最终的结果一定是哈尔滨。"
date: "2026-08-10T19:07:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102394
codeforces_index: "F"
codeforces_contest_name: "The 2019 China Collegiate Programming Contest Harbin Site"
rating: 0
weight: 102394
solve_time_s: 81
verified: true
draft: false
---

[CF 102394F - 修复横幅](https://codeforces.com/problemset/problem/102394/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正好有六幅旧横幅。 从每个横幅中，我们必须恰好选择一个字符，总共正好有六个字符。 我们可以自由地对这六个字符重新排序，最后的单词一定是`harbin`。 

关键的限制是两个角色不能来自同一个横幅，因为每个横幅只贡献一个角色。 自从这些信`harbin`都是不同的，该任务相当于询问这六个横幅是否可以与所需的六个字母一一匹配，以便每个横幅都包含其指定的字母。 

对于每个测试用例，输入由六个非空小写字符串组成。 我们需要打印`Yes`如果存在这样的一对一分配并且`No`否则。 输入最多包含 50,000 个测试用例，但每个横幅的字符总数最多为 (2\cdot10^6)。 总长度限制强烈表明扫描每个输入字符恒定次数是安全的。 多项式取决于横幅长度的算法（例如尝试多种位置组合）将过于昂贵。 

有两种微妙的情况可能会欺骗基于频率的解决方案。 首先，在组合横幅中拥有足够的每个所需字母的副本是不够的，因为一个横幅不能提供两个字母。 例如，```
1
harbin
x
x
x
x
x
```某处有所有必需的字母，但答案是`No`。 第一个横幅包含所有六个有用的字母，而其他五个横幅不包含任何一个，因此六个不同的横幅无法提供这六个字母。 

第二个问题是，所需的字母可能会在一个横幅中出现多次，但这些副本仍然只代表一个可用字符，因为我们必须从该横幅中恰好删除一个字符。 例如，```
1
hhhhhh
aaaaaa
rrrrrr
bbbbbb
iiiiii
nnnnnn
```每封必需的信件都有很多份，但答案是`Yes`因为每封所需的信件都可以从其自己的横幅中获得。 相比之下，```
1
hhhhhh
hhhhhh
aaaaaa
rrrrrr
bbbbbb
iiiiii
```没有横幅包含`n`，所以答案是`No`。 

问题来自于可用性和分配是不同的问题。 我们首先需要知道每个横幅可以提供哪些必需的字母，然后我们需要检查是否可以在不使用两次横幅的情况下组合这些可能性。 

## 方法

 直接的暴力解决方案可以从六个横幅中的每一个中选择一个位置。 如果它们的长度为(L_1,L_2,\ldots,L_6)，则有

 [
 L_1L_2L_3L_4L_5L_6
 ]

 不同的选择。 对于每个选择，我们可以检查所选的六个字符是否可以重新排列成`harbin`。 这是正确的，因为从每个横幅中获取一个字符的每一种可能的方式都被考虑了。 

问题在于选择的数量。 在(2\cdot10^6)的总长度限制下，当六个长度尽可能平衡时，即两个长度333,334和四个长度333,333，乘积最大化。 这已经给出了

 [
 333334^2\cdot333333^4
 ]

 候选选择，大约为 (1.37\cdot10^{33})。 即使在恒定时间内检查一名候选人也是不可能的。 

蛮力之所以有效，是因为它明确遵守每个横幅一个字符的限制，但它探索实际的字符位置，即使它们在横幅内的位置并不重要。 对于目标词，横幅仅与六个字母中的哪一个相关`h`,`a`,`r`,`b`,`i`， 和`n`它包含。 

这一观察结果将每个横幅减少为六位掩码。 位零可以代表`h`, 位一`a`， 等等。 如果横幅包含`h`和`r`，它的掩码准确地记录了这两种可能性。 然后，我们需要从六个掩码中的每一个中选择一个不同的目标字母。 

因为只有六个目标字母，所以我们可以用另一个六位掩码来表示已选择的字母集。 一个小的动态编程过程一次处理一个横幅。 对于每个横幅，我们要么不使用其中的特定目标字母，要么选择横幅包含的一个当前未使用的字母。 处理完所有六个横幅后，完整掩码意味着每个所需的字母已分配给不同的横幅。 

状态空间仅包含 (2^6=64) 个掩码，因此分配部分很小。 根据实际输入大小的唯一工作是扫描字符以构造六个掩码。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(L_1L_2L_3L_4L_5L_6)) | (O(1)) | (O(1)) | 太慢了|
 | 最佳 | (O(S+6^2 2^6)) | (O(2^6)) | 已接受 |

 这里（S）是一个测试用例中六个字符串的总长度。 由于 6 和 (2^6) 是常数，因此最佳解决方案与输入大小实际上是线性的。 

## 算法演练

 1. 定义目标为`harbin`并为其六个字母中的每一个分配一位。 例如，`h`使用位 0，`a`使用位 1，并且`n`使用位 5。由于所有六个目标字母都是不同的，因此每个有效的构造都对应于选择每个位一次。 
2. 读取六个横幅字符串并为每个横幅构建一个掩码。 扫描字符串时，如果其当前字符是六个目标字母之一，则设置该横幅掩码中的相应位。 同一字符重复出现并不重要，因为横幅只能提供一个字符。 
3. 创建动态规划数组`dp`拥有 64 个州。`dp[mask]`意味着，在处理横幅的某些前缀后，可以准确地选择由 表示的目标字母`mask`，最多使用每个已处理横幅中的一个字符。 
4. 初始设置`dp[0]`为 true，因为在处理任何横幅之前，尚未选择目标字母。 
5. 一张一张地处理横幅。 对于每个可达状态`mask`，检查当前横幅掩码中表示的每个目标字母。 如果该字母位尚未出现在`mask`，创建新状态`mask | bit`。 这代表从当前横幅中取出该字母。 
6. 在形成中间状态时，保留不使用特定横幅的有用字母的可能性。 这表现为将现有状态向前推进。 尽管最终解决方案必须使用每个横幅中的一个字符，但横幅可能会提供不属于`harbin`，并且这样的选择对目标字母分配没有影响。 由于恰好有六个横幅和六个必需字母，因此在处理所有横幅后包含所有六个目标字母的任何状态都必须使用每个横幅中的一个不同的有用字母。 
7. 处理完所有六个横幅后，检查状态是否`(1 << 6) - 1`是可达的。 如果是，则打印`Yes`; 否则打印`No`。 

### 为什么它有效

 不变的是`dp[mask]`当处理后的横幅可以提供由以下表示的不同目标字母时，这是正确的`mask`，没有横幅贡献超过其中一个。 当过渡添加一个位时，该位之前未被选择，因此不需要的字母不会使用两次，并且过渡会从当前横幅中获取新字母，因此没有横幅会贡献两次。 相反，任何有效的分配都可以逐个横幅跟随：每当其分配的字母属于`harbin`，相应的转换可用。 因此，当六个横幅可以一对一地提供所有六个所需字母时，就可以准确地达到完整的六位掩码。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

TARGET = "harbin"
BIT = {ch: 1 << i for i, ch in enumerate(TARGET)}
FULL = (1 << 6) - 1

def solve_case():
    masks = []

    for _ in range(6):
        s = input().strip()
        mask = 0

        for ch in s:
            bit = BIT.get(ch)
            if bit is not None:
                mask |= bit

        masks.append(mask)

    dp = [False] * (1 << 6)
    dp[0] = True

    for available in masks:
        ndp = dp[:]

        for mask in range(1 << 6):
            if not dp[mask]:
                continue

            choices = available & ~mask

            while choices:
                bit = choices & -choices
                choices -= bit
                ndp[mask | bit] = True

        dp = ndp

    return "Yes" if dp[FULL] else "No"

def main():
    t = int(input())
    answer = []

    for _ in range(t):
        answer.append(solve_case())

    sys.stdout.write("\n".join(answer))

if __name__ == "__main__":
    main()
```这`TARGET`string 修复了每个需要的字符和一位之间的对应关系。 字典查找在恒定的时间内将目标字符转换为它的位，而外部的字符`harbin`可以简单地忽略。 

对于每个横幅，`mask`只记录所需字符是否至少出现一次。 这已经足够了，因为采取第一个`h`或最后一个`h`来自同一个横幅没有区别。 这`get`call 避免了单独的成员资格测试，并且还为我们提供了一种忽略不相关小写字母的便捷方法。 

动态编程数组有 64 个条目，因为对于是否已提供每个目标字母有 6 个独立的是或否选择。`ndp = dp[:]`保留现有状态，相当于处理当前横幅而不将其目标字母之一分配给跟踪的结构。 

表达式`available & ~mask`提取当前横幅中尚未选择的可用目标字母。 低位操作`choices & -choices`一次选择一个这样的字母。 这是一种标准位掩码技术，可避免对每个可能的字符循环遍历所有 64 个掩码。 

构建掩码后，不会对横幅位置进行索引，因此不存在字符位置边界问题。 Python整数具有任意精度，尽管这里使用的最大值只有63。输入是逐行处理的，输出是累积并写入一次，这适合多达50,000个测试用例。 

## 工作示例

 对于第一个示例案例，六个横幅是`welcome`,`toparticipate`,`inthe`,`ccpccontest`,`inharbin`， 和`inoctober`。 它们的相关目标字母掩码如下所示。 

| 横幅| 可用的目标字母| 口罩状态|
 | ---| ---| ---|
 |`welcome`|`e`| 0 |
 |`toparticipate`|`a`,`i`| 10 | 10
 |`inthe`|`i`,`n`| 40 | 40
 |`ccpccontest`|`n`| 32 | 32
 |`inharbin`|`h`,`a`,`r`,`b`,`i`,`n`| 63 | 63
 |`inoctober`|`i`,`n`,`b`,`r`| 44 | 44

 第一个横幅不能提供来自以下位置的任何字符`harbin`，所以那里没有创建有用的状态。 第二个和第三个横幅可以提供一些所需的字母，后面的横幅提供额外的选择。 然而，`h`仅发生在`inharbin`，因此横幅必须提供`h`。 一旦选定，剩下的五个横幅仍然无法提供全部`a`,`r`,`b`,`i`， 和`n`无需重复使用横幅或遗漏所需的字母。 全面罩是达不到的。 

因此最终状态是错误的，给出`No`。 

对于第二个示例案例，六个横幅是`harvest`,`belong`,`ninja`,`reset`,`amazing`， 和`intriguing`。 

| 横幅| 有用的字母| 面膜|
 | ---| ---| ---|
 |`harvest`|`h`,`a`,`r`| 7 |
 |`belong`|`b`,`n`| 33 | 33
 |`ninja`|`i`,`n`,`a`| 42 | 42
 |`reset`|`r`| 4 |
 |`amazing`|`a`,`i`,`n`| 50 | 50
 |`intriguing`|`i`,`n`,`r`| 44 | 44

 一项有效的作业是接受`h`从`harvest`,`b`从`belong`,`i`从`ninja`,`r`从`reset`,`a`从`amazing`， 和`n`从`intriguing`。 每个字母都来自不同的横幅，因此可以访问完整的六位掩码。 

该算法最终达到掩码 63，因此这种情况会产生`Yes`。 该跟踪还说明了为什么包含几个有用字母的横幅不会引起问题。 DP 最多选择其中一个作为该横幅。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(S+6^2 2^6)) | (S) 字符被扫描以构建掩码，然后是恒定大小的 DP |
 | 空间| (O(2^6)) | DP 仅存储 64 个布尔状态和 6 个横幅掩码 |

 在所有测试用例中，总输入长度最多为 (2\cdot10^6)，因此字符扫描部分仅在该范围内执行线性工作。 剩下的 DP 的固定成本最多为每个案例几千次操作，即使对于 50,000 个案例也很容易管理。 因此，该解决方案完全符合规定的 1 秒时间限制和 512 MB 内存限制。 

## 测试用例```python
import sys
import io

TARGET = "harbin"
BIT = {ch: 1 << i for i, ch in enumerate(TARGET)}
FULL = (1 << 6) - 1

def solve_data(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    try:
        input = sys.stdin.readline
        t = int(input())
        ans = []

        for _ in range(t):
            masks = []

            for _ in range(6):
                s = input().strip()
                mask = 0

                for ch in s:
                    bit = BIT.get(ch)
                    if bit is not None:
                        mask |= bit

                masks.append(mask)

            dp = [False] * 64
            dp[0] = True

            for available in masks:
                ndp = dp[:]

                for mask in range(64):
                    if not dp[mask]:
                        continue

                    choices = available & ~mask

                    while choices:
                        bit = choices & -choices
                        choices -= bit
                        ndp[mask | bit] = True

                dp = ndp

            ans.append("Yes" if dp[FULL] else "No")

        return "\n".join(ans) + "\n"

    finally:
        sys.stdin = old_stdin

# Provided sample
sample = """\
2
welcome
toparticipate
inthe
ccpccontest
inharbin
inoctober
harvest
belong
ninja
reset
amazing
intriguing
"""
assert solve_data(sample) == "No\nYes\n", "provided sample"

# Minimum-size case: every banner contains exactly one required letter.
minimum = """\
1
h
a
r
b
i
n
"""
assert solve_data(minimum) == "Yes\n", "minimum-size valid case"

# All-equal values: no banner can provide six distinct target letters.
all_equal = """\
1
aaaa
aaaa
aaaa
aaaa
aaaa
aaaa
"""
assert solve_data(all_equal) == "No\n", "all-equal case"

# Several required letters are concentrated in one banner.
# Aggregate frequency is sufficient to fool a careless solution,
# but one banner can contribute only one character.
concentrated = """\
1
harbin
x
x
x
x
x
"""
assert solve_data(concentrated) == "No\n", "one-banner concentration"

# Every required letter exists, but two required letters are forced
# into the same banner, while another banner has no useful letter.
forced_conflict = """\
1
har
b
i
n
x
x
"""
assert solve_data(forced_conflict) == "No\n", "forced assignment conflict"

# Maximum total input length: exactly 2,000,000 characters.
# Each of the six banners contains its required letter once,
# so the answer is Yes.
lengths = [333334, 333334, 333333, 333333, 333333, 333333]
letters = "harbin"
large_lines = [
    letters[i] + "x" * (lengths[i] - 1)
    for i in range(6)
]
maximum = "1\n" + "\n".join(large_lines) + "\n"
assert sum(map(len, large_lines)) == 2_000_000
assert solve_data(maximum) == "Yes\n", "maximum-size case"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`h`,`a`,`r`,`b`,`i`,`n`|`Yes`| 最小尺寸的有效输入和精确的一对一分配 |
 | 六份`aaaa`|`No`| 全部相等的值和缺少必需的字母 |
 |`harbin`接下来是五个`x`字符串|`No`| 防止将组合字符频率视为足够 |
 |`har`,`b`,`i`,`n`,`x`,`x`|`No`| 检测横幅之间的强制分配冲突 |
 | 六个字符串总计 2,000,000 个字符 |`Yes`| 最大总输入尺寸和线性扫描|

 ## 边缘情况

 第一个边缘情况是将所有有用的字母集中在一个横幅中。 为了```
1
harbin
x
x
x
x
x
```第一个横幅的掩码为 63，其他横幅的掩码为 0。在处理第一个横幅时，DP 可以从掩码 0 移动到任何一位状态，但后面的横幅不能添加其他位。 掩码 63 不可达，所以结果是`No`。 这正是简单地计算所有六个字符串的出现次数给出错误答案的情况。 

第二种边缘情况是一个横幅内的字符的重复副本。 考虑```
1
hhhh
aaaa
rrrr
bbbb
iiii
nnnn
```每个横幅的掩码仅包含一位，无论副本数量如何。 DP 从每个横幅中选择一个不同的位并达到完整掩码。 结果是`Yes`。 重复的字符不能算作多个可用资源，因为每个横幅只能剪切一个字符。 

第三种边缘情况是缺少必需的字符。 为了```
1
har
b
i
n
x
x
```面具是`har`,`b`,`i`,`n`、空、空。 DP最多可以达到四位组合`h`,`a`,`r`,`b`,`i`,`n`前提是这些字母都可以由不同的横幅提供，但是`har`包含三个必需的字母，但只能提供一个。 两面空横幅不能贡献任何东西。 完整掩码无法到达，所以答案是`No`。 

最大尺寸的情况测试了不同的边界。 六个字符串总共可以包含 2,000,000 个字符，例如长度为 333,334、333,334、333,333、333,333、333,333 和 333,333。 如果每个字符串包含一次其对应的所需字母，其余由不相关的字符组成，则这六个掩码都是不同的一位掩码，答案为`Yes`。 该算法扫描所有 2,000,000 个字符一次，然后仅执行固定大小的 DP，因此大输入大小不会改变渐近行为。
