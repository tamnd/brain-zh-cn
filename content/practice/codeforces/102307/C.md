---
title: "CF 102307C - 公共子序列"
description: "我们有两条 DNA 串 A 和 B，长度均为 n。 唯一可以出现的字符是 A、T、G 和 C。我们不需要构造公共子序列。 我们只需要决定它的最大可能长度是否至少为0.99n。"
date: "2026-08-13T23:39:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102307
codeforces_index: "C"
codeforces_contest_name: "2019 ICPC Universidad Nacional de Colombia Programming Contest"
rating: 0
weight: 102307
solve_time_s: 155
verified: true
draft: false
---

[CF 102307C - 公共子序列](https://codeforces.com/problemset/problem/102307/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两条 DNA 串`A`和`B`, 两者的长度`n`。 唯一可以出现的字符是`A`,`T`,`G`， 和`C`。 我们不需要构造公共子序列。 我们只需要决定它的最大可能长度是否至少为`0.99n`。 

读取条件的一个有用方法是计算公共子序列中可能缺少的内容。 如果它的长度是`L`，那么每个原始字符串有`n - L`该公共子序列未使用的字符。 要求`L >= 0.99n`相当于`n - L <= 0.01n`。 

自从`n - L`是一个整数，我们最多允许损失`floor(n / 100)`每个字符串中的字符。 让`k = floor(n / 100)`。 

那么目标 LCS 长度恰好是`n - k`。 如果我们能找到该长度的公共子序列，那么答案是肯定的。 

的长度界限为`10^5`排除平凡`O(n^2)`LCS 动态规划。 最大尺寸意味着大约`10^10`DP 单元，远远超出了一秒的极限处理能力。 有用的参数不是LCS的全长，这几乎是`n`，但数量很少`k`我们可以丢弃的字符。 在`n = 10^5`,`k`只是`1000`。 

有几种边界情况很容易处理不当。 什么时候`n < 100`，我们有`k = 0`，因此根本不会丢弃任何字符。 例如，```
A
T
```有LCS长度`0`，而所需的长度是`1`，所以正确的输出是`Not brothers :(`。 意外舍入的解决方案`0.99n`down 会错误地接受它。 

当以下情况时，确切的阈值也很重要：`n`是的倍数`100`。 例如，```
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATA
```有长度`100`，其 LCS 为`99`。 自从`99 = 0.99 * 100`，正确答案是`Long lost brothers D:`。 要求长度严格大于`0.99n`将拒绝有效案件。 

另一种边界情况正好低于阈值。 和`n = 100`，如果濒海战斗舰是`98`，每个字符串必须丢弃两个字符，这已经太多了。 检查不匹配数量是否最多为 1 的粗心实现会将位置不匹配与删除混淆，并且可能会在移位匹配上失败。 

## 方法

 最直接的解决方案是标准 LCS 动态规划。 定义`lcs[i][j]`作为第一个的最长公共子序列`i`的字符`A`和第一个`j`的字符`B`。 如果当前字符匹配，我们可以扩展对角线状态。 否则，我们会通过从任一字符串中跳过一个字符来获得更好的结果。 这是正确的，因为每个公共子序列要么使用当前的字符对，要么跳过其中至少一个。 

问题是表的大小。 有`(n + 1)^2`状态，所以对于`n = 10^5`我们大致得到`10^10`运营。 如果存储整个表，则内存需求也将是二次的。 

关键的观察是可接受的公共子序列仅删除`k = floor(n / 100)`任一字符串中的字符。 我们可以通过每个字符串中已经删除了多少个字符来描述状态，而不是询问所有可能的前缀的 LCS。 

让`dp[i][j]`表示删除后已经可以匹配的最大字符数`i`字符来自`A`和`j`字符来自`B`。 假设当前状态包含`p = dp[i][j]`匹配的字符。 匹配的字符占据第一个`i + p`的职位`A`和第一个`j + p`的职位`B`。 因此，接下来要比较的字符是`A[i + p]`和`B[j + p]`。 

如果它们相等，则没有理由停止匹配它们。 我们可以立即扩展公共子序列，并在下一对相等时继续。 如果它们不同，则从此状态继续的任何公共子序列必须丢弃`A`或下一个字符`B`。 这正是两个转变`dp[i + 1][j] = max(dp[i + 1][j], dp[i][j])`和`dp[i][j + 1] = max(dp[i][j + 1], dp[i][j])`。 

这会将大型前缀索引 LCS 表变成仅按删除计数索引的表。 只有`(k + 1)^2`这样的状态，并且匹配阶段直接通过相等的游程移动，而不是处理每对字符串位置。 

暴力解决方案之所以有效，是因为每种可能的跳过字符的方式都由通常的 LCS 重复表示，但它失败了，因为它认为删除计数一直到`n`。 接受的答案只能删除的观察结果`1%`字符的数量让我们只保留小的删除边界。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(n^2)`|`O(n^2)`| 太慢了|
 | 最佳 |`O(nk)`摊销，其中`k = floor(n/100)`|`O(k^2)`| 已接受 |

 为了`n = 10^5`，有用的参数是`k <= 1000`，因此 DP 在大约一百万个删除状态上运行，而不是在一百亿个前缀对上运行。 匹配运行在边界上摊销，给出了该方法所需的界限。 

## 算法演练

 1. 读取两条 DNA 字符串并让`n`是它们的共同长度。 计算`k = n // 100`，因为接受的公共子序列最多可以从任一字符串中省略那么多字符。 
2. 计算所需的公共子序列长度为`target = n - k`。 这种整数形式避免了与浮点比较`0.99`。 
3.如果`k`为零，则不允许删除。 长度唯一可能的公共子序列`n`是整个字符串，所以答案很简单：是否`A`和`B`是相同的。 
4. 创建按删除计数索引的DP表。 最初`dp[0][0] = 0`，这意味着在删除任何内容之前，尚未匹配任何字符。 
5. 进程状态`(i, j)`按递增顺序。 在某种状态下，让`p = dp[i][j]`。 第一个`i`删除的字符`A`和第一个`j`删除的字符`B`，连同`p`匹配的字符，将两个当前位置放在`i + p`和`j + p`。 
6. 当两个位置都在字符串内部且字符相等时，增加`p`。 贪婪地匹配这些相等的字符是安全的，因为它们是两侧紧邻的下一个字符，因此保留它们不会导致删除，只能将公共子序列向前移动。 
7. 将扩展值存储回`dp[i][j]`。 如果已经达到`target`，已找到可接受的公共子序列，我们可以立即接受。 
8.如果`i < k`，将当前值传播到`dp[i + 1][j]`。 这表示删除下一个不匹配的字符`A`。 如果`j < k`，将其传播到`dp[i][j + 1]`，表示删除下一个不匹配的字符`B`。 我们永远不需要超越的国家`k`，因为解决方案使用了超过`k`删除不能满足所需的LCS长度。 

不变的是`dp[i][j]`存储最多使用过的有效匹配所到达的最远点`i`删除自`A`并且至多`j`删除自`B`。 当下一个字符匹配时，扩展匹配对于该状态始终是最佳的。 当它们不匹配时，每个可能的延续都必须跳过这两个字符中的至少一个，并且两个转换准确地枚举了这些可能性。 因此，每个公共子序列最多使用`k`删除由一些DP路径表示，每个DP路径对应一个有效的公共子序列。 达到`n - k`因此匹配到的字符相当于满足原始条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

YES = "Long lost brothers D:"
NO = "Not brothers :("

def is_brothers(a: str, b: str) -> bool:
    n = len(a)
    k = n // 100
    target = n - k

    # If k == 0, we need an LCS of length n.
    if k == 0:
        return a == b

    # dp[i][j] = furthest number of characters matched after
    # deleting i characters from a and j characters from b.
    size = k + 2
    dp = [[0] * size for _ in range(size)]

    for i in range(k + 1):
        row = dp[i]

        for j in range(k + 1):
            p = row[j]

            x = i + p
            y = j + p

            while x < n and y < n and a[x] == b[y]:
                p += 1
                x += 1
                y += 1

            row[j] = p

            if p >= target:
                return True

            if i < k and p > dp[i + 1][j]:
                dp[i + 1][j] = p

            if j < k and p > row[j + 1]:
                row[j + 1] = p

    return False

def main() -> None:
    a = input().strip()
    b = input().strip()

    print(YES if is_brothers(a, b) else NO)

if __name__ == "__main__":
    main()
```第一部分`is_brothers`将百分比要求转换为整数删除预算。 自从`n - LCS`是积分，`k = n // 100`正是可以删除的最大字符数。 

这`k == 0`分支处理所有短于`100`直接地。 在这种情况下，所需的 LCS 是整个字符串，因此两个输入相等既是必要的也是充分的。 

DP工作台有尺寸`(k + 2) x (k + 2)`。 额外的行和列使转换安全`i`或者`j`等于`k`。 我们仍然只处理来自`0`通过`k`，因为较大的删除计数无法产生可接受的答案。 

变量`x = i + p`和`y = j + p`是两个字符串中的实际当前位置。 消耗匹配的字符后，位置和`p`共同前进。 这比在循环内从头开始重新计算位置更不容易出错。 

支票`i < k`和`j < k`在传播到另一个删除状态之前是必要的。 如果没有它们，代码可能会访问额外的边界行或列，就好像它是有效状态一样，并且意外地使用超过允许的删除数量。 

不使用浮点运算。 测试`p >= n - n // 100`完全等同于测试`p >= 0.99n`，包括当`n`不能被整除`100`。 

Python整数在这里不存在溢出问题，并且每个DP值最多是`n`。 主内存成本来自大约一百万个 DP 条目`n = 100000`，它保持在内存限制以下。 

## 工作示例

 对于样品 1，```
A = GAATTGCGTACAATGC
B = GAATTGCGTACAATGC
```长度是`16`， 所以`k = 16 // 100 = 0`。 所需的 LCS 长度为`16`。 

| n | k | 目标| 初始状态| 结果 |
 | --- | --- | --- | --- | --- |
 | 16 | 16 0 | 16 | 16`dp[0][0] = 0`|`A == B`, 接受 |

 直接处理零删除情况，因为获得长度公共子序列的唯一方法`16`就是保留每一个角色。 两个字符串相同，因此输出为`Long lost brothers D:`。 

对于样品 2，```
A = CCATAGAGAA
B = CGATAGAGAA
```长度是`10`，所以再一次`k = 0`目标是`10`。 

| n | k | 目标| 比较| 结果 |
 | --- | --- | --- | --- | --- |
 | 10 | 10 0 | 10 | 10`CCATAGAGAA != CGATAGAGAA`| 拒绝|

 字符串的第二个字符不同。 由于删除预算为零，因此无法删除或绕过该单一差异。 他们的LCS最多是`9`，低于要求的`10`，所以正确的输出是`Not brothers :(`。 

一个更大的例子显示了实际的删除DP。 考虑```
A = AAAAAAAAAA
B = AAAATAAAAA
```这里`n = 10`，所以原来的问题仍然存在`k = 0`。 为了说明 DP 机制本身，想象一下相同的结构`n = 100`，具有一个不同的字符。 然后`k = 1`，删除多余的字符可以让两个字符串共享`99`人物。 

| 状态`(i,j)`|`p`延期前 | 下一个职位 | 行动|`p`延期后 |
 | --- | --- | --- | --- | --- |
 |`(0,0)`| 0 |`(0,0)`| 匹配相等前缀 | 4 |
 |`(1,0)`| 4 |`(5,4)`| 继续匹配 | 99 | 99
 |`(0,1)`| 4 |`(4,5)`| 继续匹配 | 99 | 99

 第一个不匹配可以通过两种方式处理。 从中删除角色`A`产生状态`(1,0)`，同时删除该字符`B`产生`(0,1)`。 其中一条路径达到所需的`99`匹配的字符。 这说明了为什么 DP 需要两个删除转换，而不是将不匹配视为简单的位置不匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(nk)`| 有`O(k^2)`删除状态，并且等字符扩展在整个`k`删除层。 |
 | 空间|`O(k^2)`| DP表包含`(k + 2)^2`整数状态。 |

 这里`k = floor(n / 100)`，所以最大`n = 100000`，我们有`k = 1000`。 该算法适用于大约一百万个删除状态，而不是普通 LCS 的大约一百亿个状态。 内存消耗也远低于完整的`n x n`濒海战斗舰表。 

## 测试用例```python
import sys
import io

YES = "Long lost brothers D:"
NO = "Not brothers :("

def is_brothers(a: str, b: str) -> bool:
    n = len(a)
    k = n // 100
    target = n - k

    if k == 0:
        return a == b

    size = k + 2
    dp = [[0] * size for _ in range(size)]

    for i in range(k + 1):
        row = dp[i]

        for j in range(k + 1):
            p = row[j]

            x = i + p
            y = j + p

            while x < n and y < n and a[x] == b[y]:
                p += 1
                x += 1
                y += 1

            row[j] = p

            if p >= target:
                return True

            if i < k and p > dp[i + 1][j]:
                dp[i + 1][j] = p

            if j < k and p > row[j + 1]:
                row[j + 1] = p

    return False

def run(inp: str) -> str:
    old_stdin = sys.stdin
    try:
        sys.stdin = io.StringIO(inp)
        a = sys.stdin.readline().strip()
        b = sys.stdin.readline().strip()
        return YES if is_brothers(a, b) else NO
    finally:
        sys.stdin = old_stdin

# Provided sample 1
assert run(
    "GAATTGCGTACAATGC\n"
    "GAATTGCGTACAATGC\n"
) == YES, "sample 1"

# Provided sample 2
assert run(
    "CCATAGAGAA\n"
    "CGATAGAGAA\n"
) == NO, "sample 2"

# Minimum size, equal strings.
assert run("A\nA\n") == YES, "minimum equal strings"

# Minimum size, different strings. k = 0, so no deletion is allowed.
assert run("A\nT\n") == NO, "minimum different strings"

# n = 100 and exactly one deletion is enough.
a = "A" * 100
b = "A" * 50 + "T" + "A" * 49
assert run(a + "\n" + b + "\n") == YES, "one deletion boundary"

# n = 100 and two deletions are necessary, which exceeds the budget.
a = "A" * 100
b = "A" * 50 + "TT" + "A" * 48
assert run(a + "\n" + b + "\n") == NO, "two deletions boundary"

# Maximum-size all-equal input.
a = "A" * 100000
assert run(a + "\n" + a + "\n") == YES, "maximum all-equal input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`A / A`|`Long lost brothers D:`| 最小尺寸和零删除验收|
 |`A / T`|`Not brothers :(`| 最小尺寸和零删除拒绝|
 | 长度`100`,插入一个`T`|`Long lost brothers D:`| 精确的`0.99n`边界|
 | 长度`100`, 插入两个`T`人物 |`Not brothers :(`| 删一预算不能超 |
 | 两条长度相等的字符串`100000`|`Long lost brothers D:`| 最大输入尺寸和大 DP 边界 |

 ## 边缘情况

 当`n < 100`，删除预算为零。 对于具体输入```
A
T
```我们得到`k = 1 // 100 = 0`和`target = 1`。 该算法立即比较两个完整的字符串，发现它们不同，因此返回`Not brothers :(`。 没有尝试解释`0.99`使用浮点舍入的阈值。 

恰好在`n = 100`，允许删除一次。 考虑```
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```第二个字符串包含一个额外的`T`相对于全`A`细绳。 DP可以达到与状态的不匹配`(0,0)`，然后删除`T`从第二个字符串中删除或删除相应的`A`从第一个字符串开始。 结果状态有一个删除并且可以匹配剩余的`99`字符，所以`p`达到`target = 99`并且算法接受。 

如果需要两次删除，同样的机制只能达到`98`在允许的删除预算内匹配的字符。 例如，与```
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```最佳公共子序列有长度`98`。 自从`k = 1`，DP 仅探索任一字符串中最多有一个删除的状态，因此它不能错误地接受需要两次删除的解决方案。 结果是`Not brothers :(`。 

相同的弦则表现出相反的极端。 对于最大尺寸输入，包括`100000`的副本`A`在这两个字符串中，初始状态贪婪地消耗了整个字符串，产生`p = 100000`。 由于目标也是`99000`，算法立即返回。 这既确认了匹配不变式，又避免了对剩余删除状态的不必要的探索。 

子序列和子串之间的区别也很重要。 不匹配并不自动意味着字符串不兼容，因为删除字符可以重新对齐两个后缀。 DP 通过删除来明确表示这两种可能性`A`或来自`B`。 这就是为什么位置汉明距离检查不能有效替代 LCS 的原因。
