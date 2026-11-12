---
title: "CF 219A - k 弦"
description: "我们得到一个小写字符串和一个整数 k。 我们可以根据需要重新排列字母。 目标是构建一个新的字符串，该字符串由依次放置的 k 个完全相同的块组成。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 219
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 135 (Div. 2)"
rating: 1000
weight: 219
solve_time_s: 82
verified: true
draft: false
---

[CF 219A - k 字符串](https://codeforces.com/problemset/problem/219/A)

 **评分：** 1000
 **标签：** 实现、字符串
 **求解时间：** 1m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个小写字符串和一个整数`k`。 我们可以根据需要重新排列字母。 目标是构建一个新字符串，其中包含以下内容：`k`相同的方块依次放置。 

例如，如果`k = 3`，那么最终的字符串必须如下所示：```
t + t + t
```其中所有三个副本都是相同的字符串`t`。 

我们唯一可以改变的是字符的顺序。 原始字符串中的每个字符在最终结果中出现的次数必须完全相同。 

限制非常小。 字符串长度最多为`1000`，并且只有`26`小写英文字母。 这立即告诉我们，我们不需要先进的算法。 甚至一个`O(n^2)`解决方案很容易通过。 这里重要的是理解使有效构造成为可能的数学条件。 

关键的观察来自频率计数。 假设最终的重复块是`t`，然后我们重复一遍`k`次。 那么整个字符串中的每个字符数都必须能被整除`k`。 

例如：```
k = 3
string = aaabbbccc
```每个字母出现`3`次，所以我们可以创建：```
abcabcabc
```但如果我们有：```
k = 2
string = aaabc
```人物`'a'`出现`3`次，不能平均分配到两个相同的块中。 任何重新安排都无法解决这个问题。 

有几种边缘情况通常会破坏不正确的实现。 

考虑：```
k = 4
s = aaaa
```正确答案是：```
aaaa
```粗心的实现可能会尝试构建长度大于`1`，即使最小的有效块只是`"a"`。 

另一个棘手的情况是：```
k = 3
s = aabbbb
```频率是：```
a -> 2
b -> 4
```两个计数都不能被整除`3`，所以答案一定是`-1`。 一种简单的方法，仅检查总长度是否可以被整除`k`会错误地认为存在解决方案，因为`6 % 3 == 0`。 

另一个微妙的情况是：```
k = 1
s = codeforces
```每个字符串自动成为一个`1`-细绳。 原始字符串本身已经有效，任何重新排列也都有效。 假设每个频率必须出现多次的实现可能会意外地拒绝这种情况。 

## 方法

 暴力破解的想法是生成字符串的排列并测试任何排列是否有效`k`-细绳。 

为了测试候选排列，我们可以将其分为`k`相同的零件并检查所有零件是否相同。 

这种方法在逻辑上是正确的，因为它最终会尝试所有可能的安排。 问题是排列的数量。 一个长度的字符串`1000`最多有`1000!`排列，其数量大得难以想象。 即使是长度`15`，蛮力变得完全不切实际。 

蛮力感觉浪费的原因是大多数排列仅在字符顺序上有所不同，而实际的有效性条件完全取决于字符频率。 

这种观察导致了最佳方法。 

假设某个字符出现`cnt`次。 在有效的`k`-string，每个重复块必须包含相同数量的该字符。 这只有在以下情况下才有可能：`cnt`可以整除`k`。 

一旦每个频率都可以被整除`k`，施工变得容易。 对于每个角色，我们放置`cnt / k`复制到基本块中。 重复该块`k`times 自动重新创建原始频率。 

例如：```
k = 2
s = aazz
```频率是：```
a -> 2
z -> 2
```每个计数都可以除以`2`。 

所以基本块变成：```
az
```重复两次给出：```
azaz
```问题从排列中的搜索减少到检查频率的整除性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n! × n) | O(n! × n) | O(n) | 太慢了 |
 | 最佳 | O(n + 26) | O(26) | 已接受 |

 ## 算法演练

 1. 阅读`k`和字符串`s`。 
2. 统计每个小写字母出现的频率。 
3. 检查每个频率是否可以被整除`k`。 

如果某些字符数不能被整除`k`， 打印`-1`并停止。 

这个条件是必要的，因为相同的重复块必须均匀地分布每个字符。 
4. 构建基础块串。 

对于每个字符，附加`frequency / k`该字符的副本到块。 
5. 完全重复基础块`k`次。 
6. 打印结果字符串。 

### 为什么它有效

 该算法依赖于一个属性：在有效的`k`-string，每个字符频率必须在所有字符之间平均分配`k`副本。 

如果出现一个字符`cnt`次总体，那么每个块必须恰好包含`cnt / k`副本。 这只有在以下情况下才可能实现：`cnt`可以整除`k`。 

当所有频率都满足这个条件时，使用构造基块`cnt / k`副本保证重复块`k`times 准确地恢复原始计数。 由于所有重复块都是相同的，因此根据定义，最终字符串是有效的`k`-细绳。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

k = int(input())
s = input().strip()

freq = [0] * 26

for ch in s:
    freq[ord(ch) - ord('a')] += 1

base = []

for i in range(26):
    if freq[i] % k != 0:
        print(-1)
        sys.exit()

    base.append(chr(i + ord('a')) * (freq[i] // k))

base_string = "".join(base)

print(base_string * k)
```代码的第一部分使用固定大小的数组来计算字符频率`26`。 由于字母表仅限于小写英文字母，因此这比使用字典更简单、更快捷。 

可除性检查是核心正确性条件。 当我们找到一个不能被整除的频率时`k`，我们知道不存在解，因此程序立即打印`-1`并退出。 

施工步骤紧凑但重要。 如果出现一个字母`cnt`次总体，那么每个重复块必须恰好包含`cnt // k`副本。 附加那么多字符到`base`构建一个有效的块。 

最后，重复基础块`k`times 重新创建原始总频率，同时保证所有部分相同。 

一个微妙的实现细节是仅在确认整除性后才使用整数除法。 否则，截断可能会默默地产生错误数量的字符。 

另一个小细节是`strip()`读取字符串时。 如果没有它，换行符将意外成为输入的一部分。 

## 工作示例

 ### 示例 1

 输入：```
2
aazz
```频率表：

 | 人物 | 频率| 能被2整除吗？ | 基地副本|
 | --- | --- | --- | --- |
 | 一个 | 2 | 是的 | 1 |
 | z | 2 | 是的 | 1 |

 基础弦乐结构：

 | 步骤| 基本字符串 |
 | --- | --- |
 | 添加“a” | 一个 |
 | 添加“z”| AZ |

 最终结果：

 | 基地| k | 输出|
 | --- | --- | --- |
 | AZ | 2 | 阿扎兹|

 这个例子展示了标准的成功案例。 每个频率均匀地分布在重复的块上。 

### 示例 2

 输入：```
3
aaabbbb
```频率表：

 | 人物 | 频率| 能被3整除吗？ |
 | --- | --- | --- |
 | 一个 | 3 | 是的 |
 | 乙| 4 | 没有 |

 自从`'b'`不能被整除`3`，算法立即停止。 

输出：```
-1
```此示例演示了关键的不可能性条件。 重新排列字符不能改变它们的频率。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + 26) | 一次计算字符，一次遍历字母 |
 | 空间| O(26) | 固定大小的频率阵列|

 输入大小最多为`1000`，所以这个解远远低于时间限制。 该算法仅扫描字符串一次，并对字母表执行不断的额外工作。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    k = int(input())
    s = input().strip()

    freq = [0] * 26

    for ch in s:
        freq[ord(ch) - ord('a')] += 1

    base = []

    for i in range(26):
        if freq[i] % k != 0:
            print(-1)
            return

        base.append(chr(i + ord('a')) * (freq[i] // k))

    print("".join(base) * k)

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    output = sys.stdout.getvalue().strip()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return output

# provided sample
assert run("2\naazz\n") == "azaz", "sample 1"

# minimum size
assert run("1\na\n") == "a", "single character"

# impossible because frequencies are not divisible
assert run("3\naabbbb\n") == "-1", "non-divisible frequencies"

# all characters equal
assert run("4\naaaa\n") == "aaaa", "all same letters"

# larger valid construction
assert run("3\naaabbbccc\n") == "abcabcabc", "repeated base block"

# boundary style case
assert run("2\nabcabc\n") == "abcabc", "already valid"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\na\n`|`a`| 尽可能最小的输入 |
 |`3\naabbbb\n`|`-1`| 检测不可能的频率分裂 |
 |`4\naaaa\n`|`aaaa`| 单个重复字符 |
 |`3\naaabbbccc\n`|`abcabcabc`| 多字符有效构造 |
 |`2\nabcabc\n`|`abcabc`| 已经有效的重复模式 |

 ## 边缘情况

 考虑：```
k = 1
s = codeforces
```每个频率都可以被整除`1`，因此该算法将整个字符串构建为基本块并重复一次。 输出是有效的，因为每个字符串都自动是`1`-细绳。 

现在考虑：```
k = 2
s = aaabc
```频率是：```
a -> 3
b -> 1
c -> 1
```该算法立即注意到`3 % 2 != 0`和打印`-1`。 

这是正确的，因为没有重新排列可以分割三个副本`'a'`均匀地分成两个相同的块。 

另一个重要的边缘情况是：```
k = 4
s = aaaa
```的频率`'a'`是`4`，所以每个块都会收到一个`'a'`。 基础块变成：```
a
```重复四次给出：```
aaaa
```这证实了算法正确处理重复块具有长度的情况`1`。 

最后，考虑：```
k = 2
s = abcabc
```频率都可以被整除`2`:```
a -> 2
b -> 2
c -> 2
```基础块变成`"abc"`，重复两次会产生`"abcabc"`。 

这表明即使输入已经是有效的，该算法也能工作`k`-细绳。
