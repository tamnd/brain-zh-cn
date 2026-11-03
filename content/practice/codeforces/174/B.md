---
title: "CF 174B - 文件列表"
description: "我们得到一个长字符串，它最初由几个连续写入的文件名组成，没有分隔符。 每个有效的文件名必须类似于 name.ext。 规则很严格。 点之前的部分仅包含小写字母，长度为 1 到 8。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 174
codeforces_index: "B"
codeforces_contest_name: "VK Cup 2012 Round 3 (Unofficial Div. 2 Edition)"
rating: 1400
weight: 174
solve_time_s: 220
verified: true
draft: false
---

[CF 174B - 文件列表](https://codeforces.com/problemset/problem/174/B)

 **评分：** 1400
 **标签：** dp、贪婪、实现
 **求解时间：** 3m 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个长字符串，它最初由几个连续写入的文件名组成，没有分隔符。 每个有效的文件名必须类似于`name.ext`。 

规则很严格。 点之前的部分仅包含小写字母，长度为 1 到 8。点之后的扩展名也仅包含小写字母，长度为 1 到 3。每个文件名必须恰好包含一个点。 

我们的任务是将整个字符串拆分为连续的子字符串，以便每个子字符串都是有效的文件名。 如果存在这样的分区，我们将打印其中的任何一个。 否则我们打印`NO`。 

输入长度可达`4 * 10^5`，这完全改变了我们思考问题的方式。 任何递归尝试所有分区的解决方案都会呈指数爆炸。 甚至一个`O(n^2)`动态规划解决方案在这种规模上是有风险的，因为它需要大约`1.6 * 10^11`最坏情况下的操作。 

关键的观察结果是有效文件名的有限长度非常小。 名称最多贡献 8 个字符，扩展名最多贡献 3 个字符，并且只有一个点。 因此每个有效段的总长度在 3 到 12 之间。这意味着从任何位置我们只需要检查恒定数量的可能的下一个切割。 

一些边缘情况很容易被错误处理。 

没有任何点的字符串永远无法工作。 

例如：```
abcdef
```无法创建有效的文件名，因为每个段只需要一个点。 

包含多个点的段也是无效的。 

例如：```
a..b
```粗心的解析器可能会将其拆分为`a.`和`.b`，但双方都不满足规则，因为名称和扩展名都必须包含字母。 

另一种棘手的情况是点太靠近一端。 

例如：```
abcdefghij.k
```名称部分的长度为 10，超过了最大值 8。 

同样：```
a.abcd
```扩展长度为4，超过了最大值3。 

当本地有效的选择阻碍未来时，就会出现一个更微妙的问题。 

考虑：```
ab.cdex.f
```子串`ab.c`有效，但剩余的`dex.f`不是因为名称长度为 3 并且有效，实际上这个有效。 一个更好的例子是：```
a.bcdefghi.j
```如果我们贪婪地采取`a.b`， 其余`cdefghi.j`是有效的。 但其他贪婪策略可能会因不同的输入而失败。 问题需要检查后缀是否也能正确分区。 

这自然会导致动态规划。 

## 方法

 蛮力的想法很简单。 从字符串的开头开始，尝试每个可能代表文件名的下一个子字符串。 然后递归求解剩下的后缀。 

这是有效的，因为最终会探索每个有效的分区。 问题是分区的数量。 尽管每个段的长度是有界的，但分支因子仍然足够大以创建指数行为。 一个长度的字符串`4 * 10^5`这样处理是不可能的。 

记忆可以极大地改善事情。 

重要的观察是剩余工作的有效性仅取决于当前指数。 一旦我们知道后缀是否从位置开始`i`可以进行分区，我们永远不需要再次重新计算它。 

更好的是，每个状态只有不断的转换。 有效的文件名长度范围为 3 到 12，因此从每个位置我们最多尝试 10 个候选子字符串。 检查一个子串是否有效也会花费恒定的时间，因为最大长度很小。 

这将指数搜索转换为线性动态规划。 

我们定义`dp[i]`后缀是否从索引开始`i`可以分区为有效的文件名。 答案是`dp[0]`。 

过渡自`i`，我们尝试每个端点`j`这样`s[i:j]`可以是有效的文件名。 如果子字符串有效并且`dp[j]`是真的，那么`dp[i]`也是如此。 

We process states from right to left so that future values are already known.

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| O(n) 递归 | 太慢了|
 | 最佳DP | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. Define a helper function that checks whether a substring is a valid file name.

 子字符串必须恰好包含一个点。 The part before the dot must have length from 1 to 8 and contain only lowercase letters. The part after the dot must have length from 1 to 3 and also contain only lowercase letters.
 2、创建DP阵列`dp`尺寸的`n + 1`。`dp[i]`表示从索引开始的后缀`i`即可分区成功。 我们设定`dp[n] = True`因为空后缀已经有效。 
3. 创建另一个数组`nxt`重建答案。 

如果我们选择一个有效的段`i`到`j`，我们存储`nxt[i] = j`。 
4. 从右到左处理索引。 

在每个位置`i`，尝试从 3 到 12 的每个子字符串长度，因为这些是唯一可能的文件名长度。 
5. 对于每个候选子串`s[i:j]`，检查两个条件。 

首先，子字符串本身必须是有效的文件名。 

第二，`dp[j]`必须已经为 true，这意味着剩余的后缀也可以被分区。 
6. 如果两个条件都成立，则标记`dp[i] = True`并存储`nxt[i] = j`。 

我们可以停止检查更多候选者，因为任何有效的分区都是可以接受的。 
7.填写完DP表后，检查`dp[0]`。 

如果为假，则打印`NO`。 

否则通过重复获取子字符串来重建答案`s[pos:nxt[pos]]`。 

### 为什么它有效

 DP 不变量很简单。`dp[i]`当后缀始于`i`可以分区为有效的文件名。 

转换已完成，因为每个有效分区都必须以某个有效文件名开头`s[i:j]`。 删除第一个段后，剩余的后缀从`j`，所以它也必须是可解的。 

这种转变是合理的，因为每当我们标记时`dp[i] = True`，我们已经明确找到了有效的第一段和剩余后缀的有效分区。 

由于我们从右到左处理，因此当我们计算时，每个需要的未来状态都已经知道`dp[i]`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def valid_file(t: str) -> bool:
    if t.count('.') != 1:
        return False

    name, ext = t.split('.')

    if not (1 <= len(name) <= 8):
        return False

    if not (1 <= len(ext) <= 3):
        return False

    return name.islower() and ext.islower()

def solve():
    s = input().strip()
    n = len(s)

    dp = [False] * (n + 1)
    nxt = [-1] * (n + 1)

    dp[n] = True

    for i in range(n - 1, -1, -1):
        for length in range(3, 13):
            j = i + length

            if j > n:
                break

            if valid_file(s[i:j]) and dp[j]:
                dp[i] = True
                nxt[i] = j
                break

    if not dp[0]:
        print("NO")
        return

    print("YES")

    pos = 0
    while pos < n:
        print(s[pos:nxt[pos]])
        pos = nxt[pos]

solve()
```辅助函数直接对文件名规则进行编码。 由于最大子串长度仅为 12，因此使用如下操作`count('.')`和`split('.')`是完全安全的并且仍然是恒定的时间。 

DP 数组从右到左填充，因为每个状态都取决于未来的位置。 空后缀标记为可达`dp[n] = True`，作为基本情况。 

内部循环仅尝试从 3 到 12 的长度。最小可能的有效文件名是`"a.b"`长度为 3。最大值为`"abcdefgh.abc"`长度为 12。 

重建阵列`nxt`存储下一段开始的位置。 没有它，我们只能知道是否存在解决方案，而不知道如何打印解决方案。 

一个微妙的实现细节是早期`break`找到有效的转换后。 该问题接受任何有效分区，因此无需继续搜索。 

另一个重要的细节是使用`j > n`作为停止条件。 这可以防止超出范围的切片逻辑并避免检查不可能的子字符串。 

## 工作示例

 ### 示例 1

 输入：```
read.meexample.txtb.cpp
```| 我| 候选人| 有效文件名 | dp[下一个] | dp[i] | dp[i] |
 | --- | --- | --- | --- | --- |
 | 18 | 18 .cpp | 没有 | - | 假|
 | 15 | 15 b.cpp | 是的 | 真实| 真实|
 | 9 | eexample.t | 是的 | 真实| 真实|
 | 0 | 读.m | 是的 | 真实| 真实|

 重建分区：```
read.m
eexample.t
xtb.cpp
```此跟踪表明该算法不会尝试恢复原始分区。 它只需要任何有效的分区。 每个选定的子字符串独立地满足文件名约束。 

### 示例 2

 输入：```
abcdef
```| 我| 候选人| 有效文件名 | dp[下一个] | dp[i] | dp[i] |
 | --- | --- | --- | --- | --- |
 | 5 | 无 | - | - | 假|
 | 4 | 无 | - | - | 假|
 | 3 | 定义 | 没有 | - | 假|
 | 0 | abcdef | 没有 | - | 假|

 由于没有子串包含有效的点结构，因此每个 DP 状态都保持为 false。 

输出：```
NO
```这表明该算法正确地拒绝了不可能进行有效分段的字符串。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个位置最多检查 10 个子串长度 |
 | 空间| O(n) | DP 和重建阵列 |

 输入大小达到`4 * 10^5`，所以线性复杂度正是我们所需要的。 常数因子也非常小，因为每个子字符串长度都以 12 为界。内存使用量很容易符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve_io(inp: str) -> str:
    input_data = io.StringIO(inp)
    output_data = io.StringIO()

    input = input_data.readline

    def valid_file(t: str) -> bool:
        if t.count('.') != 1:
            return False

        name, ext = t.split('.')

        if not (1 <= len(name) <= 8):
            return False

        if not (1 <= len(ext) <= 3):
            return False

        return name.islower() and ext.islower()

    s = input().strip()
    n = len(s)

    dp = [False] * (n + 1)
    nxt = [-1] * (n + 1)

    dp[n] = True

    for i in range(n - 1, -1, -1):
        for length in range(3, 13):
            j = i + length

            if j > n:
                break

            if valid_file(s[i:j]) and dp[j]:
                dp[i] = True
                nxt[i] = j
                break

    if not dp[0]:
        print("NO", file=output_data)
    else:
        print("YES", file=output_data)

        pos = 0
        while pos < n:
            print(s[pos:nxt[pos]], file=output_data)
            pos = nxt[pos]

    return output_data.getvalue()

# provided sample
out = solve_io("read.meexample.txtb.cpp\n")
assert out.startswith("YES")

# minimum valid case
assert solve_io("a.b\n") == "YES\na.b\n"

# no dot
assert solve_io("abcdef\n") == "NO\n"

# extension too long
assert solve_io("a.abcd\n") == "NO\n"

# maximum allowed lengths
assert solve_io("abcdefgh.abc\n") == "YES\nabcdefgh.abc\n"

# multiple valid partitions
out = solve_io("ab.cd.ef\n")
assert out.startswith("YES")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a.b`|`YES`| 尽可能小的有效文件名 |
 |`abcdef`|`NO`| 没有点的字符串|
 |`a.abcd`|`NO`| 扩展长度限制 |
 |`abcdefgh.abc`|`YES`| 最大允许长度|
 |`ab.cd.ef`|`YES`| 多个可能的分区 |

 ## 边缘情况

 考虑输入：```
a..b
```子字符串包含两个点。 在验证过程中，`count('.') != 1`立即拒绝。 No DP transition becomes valid, so the algorithm prints:```
NO
```这可以防止格式错误的名称漏掉。 

现在考虑：```
abcdefghij.k
```唯一可能的文件名分割是：```
abcdefghij.k
```名称长度为10，超出了8的限制。验证器拒绝它，所以`dp[0]`仍然是假的。 

输出是：```
NO
```接下来检查：```
a.abcd
```扩展长度为4。验证器检查`1 <= len(ext) <= 3`，失败了。 同样不存在有效的转换。 

最后考虑：```
a.ba.bc
```有多种可能的局部削减。 该算法检查每个位置的所有可行子串长度，并且仅在剩余后缀也可解时才接受分段。 

一个有效的分区是：```
a.ba
.bc
```实际上`.bc`无效，因为名称不能为空。 DP 正确地避开了这条路径。 相反，它可以选择：```
a.b
a.bc
```两个段都满足约束条件，因此算法会打印有效的答案。 这说明了为什么后缀可行性必须成为过渡的一部分，而不是做出纯粹贪婪的选择。
