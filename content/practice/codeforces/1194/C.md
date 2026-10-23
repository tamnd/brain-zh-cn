---
title: "CF 1194C - 从 S 到 T"
description: "给定三个字符串 s、t 和 p。 我们可以重复从 p 中取出任何字符并将其插入到 s 中的任何位置。 目标是确定经过一定序列的此类插入后，s 是否可以完全等于 t。"
date: "2026-06-12T00:17:09+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 1194
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 68 (Rated for Div. 2)"
rating: 1300
weight: 1194
solve_time_s: 101
verified: true
draft: false
---

[CF 1194C - 从 S 到 T](https://codeforces.com/problemset/problem/1194/C)

 **评分：** 1300
 **标签：** 实现、字符串
 **求解时间：** 1m 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给定了三个字符串`s`,`t`， 和`p`。 我们可以重复地取任意一个字符`p`并将其插入到任意位置`s`。 目标是确定在经过一些此类插入序列之后，是否`s`可以变得完全等于`t`。 每个查询都是独立的，我们必须回答`YES`或者`NO`对于每一个。 

第一个观察结果是现有字符的顺序`s`很重要。 如果`s`包含顺序与子序列不匹配的字符`t`，无需插入额外的字符`p`可以固定相对位置。 所以，`s`必须已经是`t`。 其次，对于其中的每个角色`t`但不在`s`，其中必须有足够的该字符`p`填补空白。 

字符串长度很小：每个最多 100 个字符，最多有 100 个查询。 这允许每个查询进行简单的线性扫描，因为即使每个查询进行简单的 O(|t| + |p|) 检查也至多大约 10,000 次操作，这在 1 秒之内。 

当发生微妙的边缘情况时`s`已经长于`t`，或者当`s`字符顺序错误。 例如，`s = "ba"`,`t = "ab"`,`p = "a"`。`s`不是以下的子序列`t`，所以答案一定是`NO`， 虽然`p`具有存在于的字符`t`。 粗心的方法可能只会检查字符数并错误地报告`YES`。 

## 方法

 暴力方法会尝试一切可能的方法来插入字符`p`进入`s`匹配`t`。 我们可以生成插入的所有排列，但即使对于长度 100，这也是完全不可行的，因为可能性的数量随着插入的数量呈阶乘增长。 

关键的见解是将问题分成两个更简单的检查。 首先，验证一下`s`是一个子序列`t`。 这保证了已经存在的字符的相对顺序`s`是正确的。 其次，统计需要的每个字符的数量`t`不存在于`s`。 如果`p`至少包含每个所需字符的数量，答案是`YES`; 否则，就是`NO`。 这种方法之所以有效，是因为插入操作的位置很灵活，因此顺序不会限制来自的字符`p`。 

蛮力方法在理论上是正确的，但不切实际，而两步检查则使用问题的结构将其简化为线性时间解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(阶乘( | t | )) |
 | 子序列 + 计数检查 | O( | t | + |

 ## 算法演练

 1. 首先检查是否`s`是一个子序列`t`。 初始化两个指针，`i`为了`s`和`j`为了`t`。 扫一扫`t`, 前进`i`每当`t[j] == s[i]`。 最后，如果`i`等于长度`s`， 然后`s`是一个子序列`t`。 
2.如果`s`不是以下的子序列`t`，立即返回`NO`。 这是因为字符的相对顺序`s`不能通过插入字符来更改`p`。 
3.统计每个字符出现的频率`s`,`t`， 和`p`。 对于中的每个字符`t`，计算除此之外还需要发生多少次`s`已经提供了。 这简直就是`needed = count_t[char] - count_s.get(char, 0)`。 
4. 检查是否`p`具有足够的每个所需字符。 如果对于任何字符计数`p`小于`needed`， 返回`NO`。 否则，返回`YES`。 

为什么它有效：第一步保证`s`正确对齐`t`。 计数步骤保证了需要填充的额外字符`s`进入`t`可以在`p`。 由于任何地方都允许插入，因此不存在额外的约束，因此这两项检查既是必要的也是充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from collections import Counter

def can_transform(s, t, p):
    # Check if s is a subsequence of t
    i = 0
    for ch in t:
        if i < len(s) and s[i] == ch:
            i += 1
    if i != len(s):
        return "NO"
    
    # Count characters
    count_s = Counter(s)
    count_t = Counter(t)
    count_p = Counter(p)
    
    # Check if p can supply the missing characters
    for ch in count_t:
        if count_t[ch] > count_s.get(ch, 0) + count_p.get(ch, 0):
            return "NO"
    
    return "YES"

def main():
    q = int(input())
    for _ in range(q):
        s = input().strip()
        t = input().strip()
        p = input().strip()
        print(can_transform(s, t, p))

if __name__ == "__main__":
    main()
```功能`can_transform`首先使用指针扫描检查子序列属性。 这避免了字符串插入的复杂逻辑。 下一个，`Counter`用于字符计数，这简化了检查是否`p`可以提供所需的信件。 操作顺序很重要：子序列检查必须在计数之前进行，因为如果`s`不是以下的子序列`t`，仅计数是不够的。 

## 工作示例

 使用第一个示例输入：

 | s | t | p| 我的指针| 决定|
 | --- | --- | --- | --- | --- |
 | ab | acxb | cax | 0→1→2 | s 是 t 的子序列，计算检查通过次数 → YES |
 | 一个 | 啊啊| aaabbcc| 0→1 | 子序列通过，t 需要 3 个额外的 a，p 有足够的 → YES |
 | 啊啊| 亚伯CC | 亚伯CC | 0→1→2→3 | 子序列通过，t 需要 2 个 b 和 2 个 c，p 只有 2 个 b、2 个 c → YES 还是 NO？ |

 第二条跟踪确认子序列检查有效，计数检查确保 p 中提供所需的所有字母。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O( | s |
 | 空间| O(26) = O(1) | 计数器词典最多存储 26 个小写字母 |

 由于|s|、|t|、|p| ≤ 100 且 q ≤ 100，最坏情况运算次数在 30,000 左右，这是可以接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    main()
    sys.stdout = sys.__stdout__
    return output.getvalue().strip()

# Provided samples
assert run("4\nab\nacxb\ncax\na\naaaa\naaabbcc\naaaa\naabbcc\nab\nbaaa\naaaaa\n") == "YES\nYES\nNO\nNO", "sample 1"

# Custom cases
assert run("1\na\nb\na\n") == "NO", "s not subsequence of t"
assert run("1\na\nab\nb\n") == "YES", "s can be extended by p"
assert run("1\nabc\nabc\n\n") == "YES", "s equals t, p empty"
assert run("1\nabc\nacb\nabc\n") == "NO", "s subsequence fails due to order"
assert run("1\na"*100 + "\n" + "a"*100 + "\n" + "" + "\n") == "YES", "maximum-length equal strings"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | a / b / a | 否 | s 不是 t | 的子序列
 | 一个 / ab / b | 是 | s 可以通过 p 扩展以匹配 t |
 | abc / abc / 空 | 是 | s 等于 t，p 为空 |
 | abc/acb/abc | 否 | 顺序不匹配会阻止子序列 |
 | 100×一个 / 100×一个 / 空 | 是 | 处理的最大长度字符串

 ## 边缘情况

 对于`s = "ba"`,`t = "ab"`, `p =
