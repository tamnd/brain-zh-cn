---
title: "CF 202A-LLPS"
description: "我们得到一个小写字符串，必须按顺序选择一些字符，以形成一个既是回文又是字典序尽可能大的子序列。 子序列不需要保持连续。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "bitmasks", "brute-force", "greedy", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 202
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 127 (Div. 2)"
rating: 800
weight: 202
solve_time_s: 66
verified: true
draft: false
---

[CF 202A - LLPS](https://codeforces.com/problemset/problem/202/A)

 **评分：** 800
 **标签：** 二分查找、位掩码、暴力破解、贪婪、实现、字符串
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个小写字符串，必须按顺序选择一些字符，以形成一个既是回文又是字典序尽可能大的子序列。 

子序列不需要保持连续。 我们可以跳过字符，但剩余的字符必须保持原来的顺序。 

字符串长度最多为 10，这个长度很小。 甚至指数算法在这里在技术上也是可行的。 对所有子序列进行暴力搜索最多会检查$2^{10} = 1024$候选人，很容易符合限制。 

这个问题有趣的部分不是性能，而是识别隐藏在字典顺序中的结构。 

一个常见的错误是假设回文越长越好。 字典顺序不是这样的。 例如：

 输入：```
radar
```可能的回文子序列包括`"radar"`和`"rr"`。 

虽然`"radar"`更长，`"rr"`按字典顺序更大，因为第一个不同的字符是`'r'`相对`'a'`， 和`'r' > 'a'`。 

另一个容易犯的错误是尝试首先构建最长的回文子序列，然后才最大化字典顺序。 这些是不同的目标。 

例如：

 输入：```
abac
```最长的回文子序列是`"aba"`，但正确答案是：```
c
```按字典顺序，任何以`'c'`敲击以以下开头的每根弦`'a'`。 

当最大的字符多次出现时，会出现一种更微妙的情况。 

输入：```
azbz
```正确答案是：```
zz
```粗心的解决方案可能只会输出`"z"`，但如果最大字符出现多次，则将所有字符自动形成回文并给出字典序上更大的结果，因为较长的等前缀字符串更大。 

## 方法

 蛮力方法很简单，因为输入很小。 

我们可以使用位掩码生成每个子序列。 对于每个子序列，我们检查它是否是回文。 在所有回文子序列中，我们保留字典顺序最大的一个。 

这是有效的，因为只有$2^n$子序列。 和$n \le 10$，即最多 1024 名候选人。 即使我们花费$O(n)$通过构建和检查每个子序列，总工作量仍然很小。 

对于这个问题，暴力方法是完全可以接受的。 尽管如此，还有一个更简单的观察。 

假设字符串中出现的最大字符是`'z'`。 任何以较小字符开头的回文永远无法击败以`'z'`，与长度无关。 

现在考虑这个最大字符的所有出现。 如果我们取其中的每一个，得到的字符串完全由相同的字母组成，这自动是回文。 

例如：```
abzczz
```最大字符为`'z'`，出现了3次。 子序列`"zzz"`是一个回文，并且没有任何以较小字符开头的回文可以在字典顺序上击败它。 

这样就彻底解决了这个问题：

 答案很简单，就是字符串中出现的所有最大字符。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n \cdot n) | O(2^n \cdot n) | O(n) | 已接受 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取输入字符串。 
2. 使用Python查找字符串中的最大字符`max()`。 

该字符必须出现在字典顺序上最大的回文的开头。 任何较小的起始字符都会在字典比较中立即丢失。 
3. 再次遍历字符串并收集该最大字符的每次出现。 

完全由一个重复字符组成的字符串始终是回文。 
4. 打印结果字符串。 

### 为什么它有效

 设字符串中的最大字符为`c`。 

任何以小于的字符开头的回文子序列`c`按字典顺序自动小于以开头的子序列`c`。 

所以最佳答案必须从`c`。 

一旦第一个字符固定为`c`，添加更多副本`c`只会改善结果。 如果两个字符串共享相同的前缀，则越长的字符串按字典顺序越大。 

由于所有副本`c`形成一个有效的回文，每次出现都会产生最大可能的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

s = input().strip()

mx = max(s)

answer = []

for ch in s:
    if ch == mx:
        answer.append(ch)

print("".join(answer))
```该解决方案直接遵循上面证明的观察结果。`max(s)`查找字符串中出现的按字典顺序最大的字符。 

第二个循环收集该字符的每次出现，同时保留顺序。 由于所有选定的字符都是相同的，因此生成的子序列自动是回文。 

一个微妙的一点是，我们必须考虑所有发生的情况，而不仅仅是一种情况。 如果最大字符出现多次，则相同重复字符的较长字符串按字典顺序会更大。 

例如：```
"zz" > "z"
```因为`"z"`是一个前缀`"zz"`。 

另一个细节是保留子序列的顺序。 从左到右迭代自然会保持原始顺序。 

## 工作示例

 ### 示例 1

 输入：```
radar
```| 职位| 人物 | 最大字符 | 添加到答案 | 当前答案 |
 | --- | --- | --- | --- | --- |
 | 0 | r | r | 是的 | r |
 | 1 | 一个 | r | 没有 | r |
 | 2 | d | r | 没有 | r |
 | 3 | 一个 | r | 没有 | r |
 | 4 | r | r | 是的 | RR |

 输出：```
rr
```这个例子说明了为什么字典顺序主导回文长度。`"rr"`节拍`"radar"`因为第一个不同的字符更大。 

### 示例 2

 输入：```
azbz
```| 职位| 人物 | 最大字符 | 添加到答案 | 当前答案 |
 | --- | --- | --- | --- | --- |
 | 0 | 一个 | z | 没有 | |
 | 1 | z | z | 是的 | z |
 | 2 | 乙| z | 没有 | z |
 | 3 | z | z | 是的 | zz |

 输出：```
zz
```该跟踪说明了为什么我们必须包含最大字符的每次出现。`"zz"`按字典顺序大于`"z"`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 一关找到最大角色，一关收集它 |
 | 空间| O(n) | 答案可能包含字符串 | 的所有字符

 和$n \le 10$，程序立即运行。 即使是暴力解决方案也很容易适应，但是贪婪的观察将实现减少到几行。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    s = input().strip()

    mx = max(s)

    ans = []

    for ch in s:
        if ch == mx:
            ans.append(ch)

    print("".join(ans))

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue().strip()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out

# provided sample
assert run("radar\n") == "rr", "sample 1"

# custom cases
assert run("a\n") == "a", "single character"
assert run("aaaaa\n") == "aaaaa", "all equal characters"
assert run("abac\n") == "c", "largest character appears once"
assert run("azbz\n") == "zz", "largest character appears multiple times"
assert run("zyxwvutsrq\n") == "z", "strictly decreasing characters"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a`|`a`| 最小尺寸输入 |
 |`aaaaa`|`aaaaa`| 所有字符均相等 |
 |`abac`|`c`| 回文串并不总是越长越好 |
 |`azbz`|`zz`| 必须采用所有最大字符 |
 |`zyxwvutsrq`|`z`| 最大字符出现一次 |

 ## 边缘情况

 考虑输入：```
abac
```最大字符为`'c'`。 该算法扫描字符串并只保留`'c'`，生产：```
c
```最长回文算法将产生`"aba"`，这是错误的，因为按字典顺序：```
c > aba
```该算法之所以成功，是因为它优先考虑第一个字符。 

现在考虑：```
zzza
```最大字符为`'z'`。 该算法收集每个`'z'`和输出：```
zzz
```只返回一个最大字符的粗心实现会产生`"z"`，它更小，因为`"z"`是一个前缀`"zzz"`。 

最后，考虑：```
bacab
```最大字符为`'c'`，出现一次。 该算法输出：```
c
```虽然`"bacab"`本身是一个回文，它开始于`'b'`，所以它按字典顺序输给任何以`'c'`。
