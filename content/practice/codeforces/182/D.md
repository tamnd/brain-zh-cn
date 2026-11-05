---
title: "CF 182D - 公约数"
description: "我们得到两个小写字符串。 如果 s 可以通过连续连接 d 多次而形成，则字符串 d 称为另一个字符串 s 的除数。 例如，“ab”可以除“ababab”，因为重复“ab”三次可以得到完整的字符串。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "hashing", "implementation", "math", "strings"]
categories: ["algorithms"]
codeforces_contest: 182
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 117 (Div. 2)"
rating: 1400
weight: 182
solve_time_s: 96
verified: true
draft: false
---

[CF 182D - 公约数](https://codeforces.com/problemset/problem/182/D)

 **评分：** 1400
 **标签：** 暴力破解、哈希、实现、数学、字符串
 **求解时间：** 1m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到两个小写字符串。 一个字符串`d`称为另一个字符串的除数`s`如果`s`可以通过连接形成`d`连续几次。 

例如，`"ab"`划分`"ababab"`因为重复`"ab"`三次给出完整的字符串。 另一方面，`"aba"`不分开`"ababab"`因为重复它永远不会准确地产生目标。 

任务是计算有多少字符串同时划分两个输入字符串。 

字符串长度最多为`10^5`，这立即排除了昂贵的子串生成与重复重建的结合。 任何接近的东西`O(n^2)`当两个字符串都很大时，字符工作可能会变得太慢。 执行数百亿次操作的解决方案将无法在时限内完成。 我们需要一些接近线性或`O(n log n)`。 

棘手的部分是匹配前缀是不够的。 候选除数必须在整个字符串中完美重复。 

考虑这个输入：```
ababab
abab
```公约数是`"ab"`， 不是`"abab"`。 粗心的实现可能只检查两个字符串是否以相同的前缀开头并意外计数`"abab"`即使它不能平铺`"ababab"`完全地。 

当候选长度不能除以整个字符串长度时，就会出现另一个容易的错误。```
aaa
aa
```唯一的公约数是`"a"`。 

一种幼稚的方法可能会治疗`"aa"`有效，因为两个字符串都以`"aa"`， 但`"aa"`无法生成`"aaa"`通过重复。 

单字符字符串也很重要：```
a
a
```答案是`1`， 因为`"a"`将两个字符串分开。 

具有相同字符数的不同模式也可能会破坏错误的解决方案：```
abab
abba
```答案是`0`。 

两个字符串都包含相同的字母，但没有重复的基本字符串可以准确地生成这两个字符串。 

## 方法

 最直接的解决方案是尝试每一个可能的子串作为候选除数。 对于每个候选者，我们检查重复它是否可以准确地重建两个字符串。 

假设第一个字符串的长度`n`第二个有长度`m`。 在最坏的情况下，有`O(min(n, m))`候选长度。 对于每个候选者，重建和比较字符串的成本高达`O(n + m)`。 

这给出了总的复杂性`O(min(n, m) * (n + m))`。 

长度接近`10^5`，这变得太昂贵了。 最坏情况的输入可能需要大约`10^10`字符操作。 

关键的观察是有效的除数长度必须除以两个字符串长度。 

如果一个字符串的长度`k`生成一个长度的字符串`n`， 然后`k`必须划分`n`确切地。 因此，我们不需要检查每个可能的长度，而只需检查两个长度的公约数。 

例如，如果字符串有长度`8`和`16`，唯一可能的除数长度是以下的公约数`8`和`16`，即`1`,`2`,`4`， 和`8`。 

这大大减少了候选人的数量。 整数的约数很少，通常最多几百个左右的值`10^5`。 

对于每个有效长度`k`，我们取长度前缀`k`从第一个字符串开始，并验证重复它是否可以重建两个字符串。 

使用重复和相等比较可以有效地完成验证本身。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(min(n,m) × (n+m)) | O(n+m) | 太慢了|
 | 最佳 | O((n+m) × d) | O(n+m) | 已接受 |

 这里`d`是字符串长度的公约数，在实际中非常小。 

## 算法演练

 1. 读取两个输入字符串。 
2. 计算它们的长度`n`和`m`。 
3. 迭代所有整数`k`从`1`到`min(n, m)`。 
4. 跳过任何`k`不能将两者分开`n`和`m`。 

长度重复的块`k`只能生成长度为以下倍数的字符串`k`。 
5. 采取第一个`k`第一个字符串的字符作为候选除数。 
6. 通过重复候选值来重建第一个字符串`n // k`次。 
7. 通过重复候选值重建第二个字符串`m // k`次。 
8. 如果两个重建的字符串与原始字符串完全匹配，则增加答案。 
9. 打印最终计数。 

### 为什么它有效

 每个有效的除数字符串必须作为两个字符串的前缀出现，因为重复总是从头开始。 它的长度也必须精确地除以两个字符串的长度。 

该算法检查每个可能的公约数长度，并验证相应的前缀是否真正通过重复生成两个字符串。 不能错过任何有效的除数，因为每个除数都必须满足这些属性。 无法计算无效除数，因为重构保证与两个原始字符串完全相等。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    s1 = input().strip()
    s2 = input().strip()

    n = len(s1)
    m = len(s2)

    ans = 0

    for k in range(1, min(n, m) + 1):
        if n % k != 0 or m % k != 0:
            continue

        candidate = s1[:k]

        if candidate * (n // k) == s1 and candidate * (m // k) == s2:
            ans += 1

    print(ans)

solve()
```该循环检查每个可能的除数长度。 可整性条件是必不可少的，因为重复块不能生成长度不是块长度倍数的字符串。 

候选除数总是取自前缀`s1`。 任何有效的除数都必须从字符串的开头开始，因此不需要检查任意子字符串。 

重建步骤是强制正确性的地方。 即使两个字符串共享相同的前缀，重复模式也可能会在字符串中稍后失败。 构建重复的字符串并与原始字符串进行比较可以清楚地捕获这些情况。 

一个微妙的细节是使用`.strip()`读取输入时。 如果没有它，换行符将成为字符串的一部分并破坏所有比较。 

另一个容易犯的错误是忘记分别检查两个字符串。 候选人可能会分裂`s1`正确但失败`s2`。 

## 工作示例

 ### 示例 1

 输入：```
abcdabcd
abcdabcdabcdabcd
```| k | 两个长度相除？ | 候选人 | 重建 s1 | 重建 s2 | 有效的？ |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 是的 |`"a"`|`"aaaaaaaa"`|`"aaaaaaaaaaaaaaaa"`| 没有 |
 | 2 | 是的 |`"ab"`|`"abababab"`|`"abababababababab"`| 没有 |
 | 4 | 是的 |`"abcd"`|`"abcdabcd"`|`"abcdabcdabcdabcd"`| 是的 |
 | 8 | 是的 |`"abcdabcd"`|`"abcdabcd"`|`"abcdabcdabcdabcd"`| 是的 |

 回答：`2`此跟踪显示了为什么仅匹配前缀是不够的。`"ab"`出现在两个字符串的开头，但无法正确平铺它们。 

### 示例 2

 输入：```
aaa
aa
```| k | 两个长度相除？ | 候选人 | 重建 s1 | 重建 s2 | 有效的？ |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 是的 |`"a"`|`"aaa"`|`"aa"`| 是的 |
 | 2 | 没有 | - | - | - | 已跳过 |

 回答：`1`此示例说明了为什么除数长度很重要。`"aa"`不能考虑，因为长度`2`不分开`3`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n+m) × d) |`d`是检查的公约数长度的数量 |
 | 空间| O(n+m) | 比较期间临时重复的字符串 |

 值的除数数量高达`10^5`非常小，因此解决方案很容易在时间限制内完成。 即使输入大小达到最大，重复工作量仍然是可控的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve():
        s1 = input().strip()
        s2 = input().strip()

        n = len(s1)
        m = len(s2)

        ans = 0

        for k in range(1, min(n, m) + 1):
            if n % k != 0 or m % k != 0:
                continue

            candidate = s1[:k]

            if candidate * (n // k) == s1 and candidate * (m // k) == s2:
                ans += 1

        return str(ans)

    return solve()

# provided sample
assert run("abcdabcd\nabcdabcdabcdabcd\n") == "2", "sample 1"

# minimum-size input
assert run("a\na\n") == "1", "single character strings"

# no common divisors
assert run("abab\nabba\n") == "0", "same letters, different structure"

# repeated same character
assert run("aaaaaa\naaa\n") == "2", "divisors are 'a' and 'aaa'"

# boundary length divisibility
assert run("aaa\naa\n") == "1", "length mismatch prevents 'aa'"

# identical strings
assert run("xyzxyz\nxyzxyz\n") == "2", "divisors are 'xyz' and full string"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a / a`|`1`| 最小有效输入 |
 |`abab / abba`|`0`| 共享前缀还不够 |
 |`aaaaaa / aaa`|`2`| 多个有效除数长度 |
 |`aaa / aa`|`1`| 长度整除条件 |
 |`xyzxyz / xyzxyz`|`2`| 具有多个除数的相同字符串 |

 ## 边缘情况

 考虑输入：```
aaa
aa
```算法检查`k = 1`和`k = 2`。 

为了`k = 1`，候选人是`"a"`。 重复它会准确地产生两个原始字符串，因此它被计数。 

为了`k = 2`，算法立即跳过，因为`2`不分开`3`。 

这可以防止错误包含`"aa"`。 

现在考虑：```
abab
abba
```可能的公约数长度是`1`,`2`， 和`4`。 

为了`k = 1`，候选人是`"a"`。 重复它给出`"aaaa"`和`"aaaa"`，失败了。 

为了`k = 2`，候选人是`"ab"`。 重复它给出`"abab"`和`"abab"`。 第二次重建不匹配`"abba"`。 

为了`k = 4`，候选人是`"abab"`。 重复一次给出`"abab"`对于第一个字符串但是`"abab"`不匹配`"abba"`。 

答案正确变为`0`。 

最后，考虑相同的字符串：```
abcabc
abcabc
```该算法检查长度`1`,`2`,`3`， 和`6`。 

仅有的`"abc"`和`"abcabc"`正确地重建两个字符串。 

这证实了算法在有效时会计算原始除数和完整字符串本身。
