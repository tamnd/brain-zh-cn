---
title: "CF 2175C - 大海捞针"
description: "我们有两个字符串，s 和 t。 目标是重新排列 t 的字母，使 s 在结果字符串中显示为子序列，同时使最终字符串按字典顺序尽可能小。"
date: "2026-06-09T04:32:19+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "strings"]
categories: ["algorithms"]
codeforces_contest: 2175
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 1069 (Div. 2)"
rating: 1200
weight: 2175
solve_time_s: 97
verified: false
draft: false
---

[CF 2175C - 大海捞针](https://codeforces.com/problemset/problem/2175/C)

 **评分：** 1200
 **标签：** 贪心，字符串
 **求解时间：** 1m 37s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两个字符串，`s`和`t`。 目标是重新排列字母`t`这样`s`在结果字符串中显示为子序列，同时使最终字符串按字典顺序尽可能小。 子序列意味着我们可以删除其中的字母`t`但不能改变它们的相对顺序。 如果没有办法包含`s`作为子序列，我们必须输出“Impossible”。 

约束表明所有长度的总和`t`测试用例中的字符串最多为 100,000 个，因此任何相对于总输入大小以线性时间运行的解决方案都足够高效。 二次或更高的复杂度不太适合 2 秒的限制，因为`10^5 × 10^5`操作太多了。 

当出现不明显的边缘情况时，`t`包含某些字符的出现次数少于`s`需要。 例如，如果`s = "aa"`和`t = "ab"`，我们无法形成`s`作为子序列，因为只有一个`'a'`在`t`。 另一个微妙的情况是字典顺序：简单地插入`s`在排序的开始或结束处`t`字母可能不会产生最小的字符串。 例如，`s = "dc"`和`t = "abcd"`。 排序`t`给出`"abcd"`，但是插入`s`在开始时产生`"dcab"`，大于`"abcdc"`。 

## 方法

 蛮力方法会考虑所有排列`t`并检查是否`s`是一个子序列。 这在原则上是正确的，但完全不可行：对于`|t| = 10^5`，排列的数量是天文数字。 我们甚至无法部分地列举它们。 

关键的观察结果是，问题简化为计算字母并确定周围剩余字母的顺序`s`以保持词典编排的最小性。 具体来说，如果我们知道每个字符出现了多少次`t`，我们可以减去所需的计数`s`并自由地重新排序剩余的字母。 主要的挑战是决定放置在哪里`s`在这些剩余字母中产生字典顺序最小的结果。 

贪婪的洞察力是有效的：考虑第一个字符`s`。 如果我们放置`s`在所有字母都小于第一个字符的位置`s`在它之前，所有较大的字母都在它之后，我们得到最小的结果。 当字母等于第一个字符时有一种微妙的情况`s`出现在剩菜中：我们需要决定它们是出现在之前还是之后`s`。 测试完示例后，将它们放在前面`s`仅当它们出现在第一个位置之前`s`确保最小化。 一个更简单的策略是比较`s`剩下的相同字母块：如果`s`按字典顺序小于相同字母的字符串，放置`s`第一的; 否则将其放在后面。 

这种方法在每个字符串的线性时间内工作，因为我们只计算字母并构建最终的字符串。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O( | t | !) |
 | 贪心计数| O( | t | ) |

 ## 算法演练

 1. 统计每个字母出现的频率`t`使用 26 个元素的固定大小数组，每个小写字母一个元素。 这使我们能够快速减去中使用的字母`s`。 
2. 对于中的每个字母`s`，从频率数组中减少其计数。 如果任何计数变为负数，则打印“不可能”，因为`t`没有包含足够的字母来形成`s`作为子序列。 
3. 按顺序构造最终的字符串。 对于每个角色`c`从`'a'`到`'z'`，附加所有剩余的副本`c`之前或之后`s`根据字典顺序比较：

 - 如果`c`小于第一个字符`s`，附加所有剩余的`c`前`s`。 
- 如果`c`等于第一个字符`s`, 比较字符串`s`和`c`重复剩余的数量`c`s。 如果`s`按字典顺序较小，插入`s`第一的; 否则，附加剩余的`c`先是然后`s`。 
- 如果`c`大于第一个字符`s`，附加所有剩余的`c`后`s`。 
4. 一旦所有字符都放置完毕，我们就获得了按字典顺序最小的字符串，其中包含`s`作为子序列。 

为什么它有效：该算法确保所有字母都小于开头`s`出现在之前`s`所有较大的字母都出现在后面。 仔细处理相同的字母可以保证我们不会创建比必要的更大的字符串。 计数保证我们删除的字母不会多于可用的字母。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    T = int(input())
    for _ in range(T):
        s = input().strip()
        t = input().strip()
        freq = [0]*26
        for c in t:
            freq[ord(c)-ord('a')] += 1
        for c in s:
            freq[ord(c)-ord('a')] -= 1
            if freq[ord(c)-ord('a')] < 0:
                print("Impossible")
                break
        else:
            result = []
            first_s = s[0]
            for i in range(26):
                c = chr(i+ord('a'))
                if c < first_s:
                    result.append(c*freq[i])
                elif c == first_s:
                    # Decide whether s should go before or after leftover c's
                    leftover_c = c*freq[i]
                    if s < leftover_c:
                        result.append(s)
                        result.append(leftover_c)
                    else:
                        result.append(leftover_c)
                        result.append(s)
                    freq[i] = 0
                else:
                    result.append(c*freq[i])
            print(''.join(result))

if __name__ == "__main__":
    solve()
```该代码首先计算所有字母`t`并删除所需的`s`。 如果在任何时候有一封信`s`缺失，我们立即打印“Impossible”。 否则，我们遍历所有字母，放置比第一个字母小的字母`s`在它之前。 通过比较仔细处理等于第一个字符的字母`s`用剩余的字母块来决定最小插入点。 其余字母随后附上。 

## 工作示例

 输入示例 1：`s = "dcbe"`,`t = "bedbaecfc"`| 步骤| 频率数组（部分）| 结果字符串 |
 | --- | --- | --- |
 | 计数 t | b:2、c:2、d:2、e:2、a:1、f:1 | “” |
 | 减去 s | d:1、c:1、b:1、e:1 | “” |
 | 构建结果 | a:1 → “a”，b=1 → “b”，c=1 → “c”，d=1 → “d”，e=1 → “e”，f=1 → “f” | “abcdc牛肉” |

 这会产生预期的字典顺序最小字符串，其中包含`s`。 

输入示例 2：`s = "bab"`,`t = "ababa"`| 步骤| 频率数组（部分）| 结果字符串 |
 | --- | --- | --- |
 | 计数 t | a：3，b：2 | “” |
 | 减去 s | b：1，a：2，b：1 | “” |
 | 构建结果 | a=2 → "aa", b=1 → "b", 插入 s="bab" | “aa”+“bab”+“b”？ 实际上“aa”+“bab”=“aabab” |

 演示之前剩余的字母如何`s`和`s`放置产生最少的字符串。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(|t|
 | 空间| O(1) | O(1) | 26 个字符的固定大小数组就足够了 |

 鉴于总和`|t|`所有测试用例的数量为 10^5，该算法在时间限制内有效运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    sys.stdout = sys.__stdout__
    return output.getvalue().strip()

# Provided samples
assert run("3\ndcbe\nbedbaecfc\nbabadab\nabacabadabacaba\nbabaisyou\nflagiswin") == "abcdcbeef\naaaaabababccdab\nImpossible"

# Custom cases
assert run("1\na\na") == "a", "single letter input"
assert run("1\nab\nba") == "ab", "reordering needed"
assert run("1\naa\naa") == "aa", "all letters identical"
assert run("1\nabc\ndefabc") == "abcdef", "s at end"
assert run("1\nabc\naabbcc") == "aabbccabc", "multiple same letters"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 一个/一个| 一个 | 最小尺寸输入|
 | ab / ba | ab | 简单的重新排序 |
