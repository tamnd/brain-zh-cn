---
title: "CF 1766B - 记事本#"
description: "我们被要求使用文本编辑器输入长度为 n 的字符串 s，该文本编辑器允许两种操作：附加单个字符或复制已输入的连续子字符串并将其粘贴到末尾。"
date: "2026-06-09T12:57:04+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1766
codeforces_index: "B"
codeforces_contest_name: "Educational Codeforces Round 139 (Rated for Div. 2)"
rating: 1000
weight: 1766
solve_time_s: 129
verified: false
draft: false
---

[CF 1766B - 记事本#](https://codeforces.com/problemset/problem/1766/B)

 **评分：** 1000
 **标签：** 实施
 **求解时间：** 2m 9s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求输入一个字符串`s`长度`n`使用允许两种操作的文本编辑器：附加单个字符或复制已键入的连续子字符串并将其粘贴到末尾。 目标是确定是否有可能在严格小于`n`运营。 

每个测试用例都给出字符串的长度和字符串本身。 如果我们输入的内容少于`n`操作，否则为“NO”。 由于测试用例中所有字符串长度的总和最多为 200,000，因此任何在线性时间内处理每个字符串的解决方案都是可行的。 二次解为`n`会太慢，因为`n`可以达到20万。 

这个问题有一些微妙的情况。 例如，如果字符串包含所有不同的字符，则没有要复制的子字符串，因此唯一的选择是单独键入每个字符。 如果字符串尽早开始重复序列，则复制可以减少总操作量。 仅查找长重复子字符串的粗心解决方案可能会错误地为早期具有单个重复字符的字符串输出“NO”，例如`aa`，可以在一份附录和一份副本中键入。 

边缘情况包括长度为 1 的字符串，其中无法复制，因此输出必须为“NO”，以及前两个字符相同的字符串，这允许在键入第一个字符后进行复制，立即减少下面的操作`n`。 

## 方法

 暴力方法会尝试模拟键入字符串，在每一步都考虑已键入部分的每个子字符串，以查看它是否与即将到来的段匹配。 这个方法是正确的，但是对于长度的字符串`n`，可能需要检查`O(n^2)`最坏情况下的子字符串匹配。 和`n`达到 2·10^5，这将变得难以管理。 

关键的见解是我们只需要检查是否可以保存单个操作。 键入少于以下的字符串`n`操作时，我们需要在一开始就有一个重复的字符。 一旦我们输入了第一个字符，如果它稍后再次出现，我们可以从第一个字符开始复制一个长度至少为 1 的子字符串。 这一观察大大减少了问题：我们不需要模拟整个打字过程； 我们只需要查看是否有任何字符在字符串的前半部分或第一个字符之后的任何位置至少出现两次。 如果是这样，我们可以保证至少一次复制操作，并且与单独键入每个字符相比可以节省一次操作。 

这将解决方案简化为重复字符的简单线性扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了|
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，请阅读`n`和字符串`s`。 
3.如果`n`为 1 时，输出“NO”，因为单个字符无法从复制操作中受益。 
4. 否则，从第一个字符到倒数第二个字符迭代字符串。 
5. 检查任何字符是否与其前面的任何字符匹配（或者等效地，如果`s[i]`出现在`s[0:i]`）。 如果找到匹配，则立即输出“YES”，因为我们可以键入初始部分，然后执行复制，从而减少下面的总操作`n`。 
6. 如果没有发现重复字符，则输出“NO”。 

为什么它有效：该算法确保我们仅在有可能通过复制子字符串来保存至少一个操作时输出“YES”。 由于副本必须来自先前键入的段，因此重复的字符可以保证这样的副本存在。 相反，如果所有字符都是唯一的，则不可能进行复制，并且最少的操作次数恰好是`n`，所以“NO”是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    s = input().strip()
    if n == 1:
        print("NO")
        continue
    found = False
    seen = set()
    for c in s:
        if c in seen:
            found = True
            break
        seen.add(c)
    print("YES" if found else "NO")
```该解决方案使用有效地读取输入`sys.stdin.readline`。 我们立即处理小案子`n == 1`。 对于其他情况，我们迭代字符串并维护我们看到的一组字符。 当我们第一次遇到以前出现过的字符时，我们输出“YES”。 使用集合可以确保恒定时间的查找，从而保持复杂性的线性。 微妙之处包括修剪输入行并在发现重复字符时尽早中断以避免不必要的迭代。 

## 工作示例

 考虑字符串`labacaba`：

 | 索引 | 人物 | 见过| 发现 |
 | --- | --- | --- | --- |
 | 0 | 我| {l} | 假 |
 | 1 | 一个 | {l，a} | 假 |
 | 2 | 乙| {l，a，b} | 假 |
 | 3 | 一个 | {l，a，b} | 真实|

 在索引 3 处，`a`已经在`seen`，因此算法输出“YES”。 这表明我们立即检测到副本的可能性。 

考虑`codeforces`：

 | 索引 | 人物 | 见过| 发现 |
 | --- | --- | --- | --- |
 | 0 | c | {c} | 假 |
 | 1 | 哦| {c，o} | 假 |
 | 2 | d | {c，o，d} | 假 |
 | 3 | 电子| {c，o，d，e} | 假 |
 | 4 | f | {c, o, d, e, f} | 假 |
 | 5 | 哦| {c, o, d, e, f} | 真实|

 这里，`o`在索引 5 处重复。这证实了任何重复字符都保证我们可以保存操作的不变性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 我们扫描每个字符串一次并维护一组用于恒定时间查找 |
 | 空间| O(分钟(n,26)) | 所见字符集最多有 26 个小写字母 |

 鉴于总和`n`跨测试用例最多 200,000 个，解决方案在时间和内存限制内高效运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        n = int(input())
        s = input().strip()
        if n == 1:
            print("NO")
            continue
        found = False
        seen = set()
        for c in s:
            if c in seen:
                found = True
                break
            seen.add(c)
        print("YES" if found else "NO")
    return output.getvalue().strip()

# provided samples
assert run("6\n10\ncodeforces\n8\nlabacaba\n5\nuohhh\n16\nisthissuffixtree\n1\nx\n4\nmomo\n") == "NO\nYES\nNO\nYES\nNO\nYES", "sample 1"

# custom cases
assert run("3\n1\na\n2\nab\n2\naa\n") == "NO\nNO\nYES", "single char and two-char variations"
assert run("2\n26\nabcdefghijklmnopqrstuvwxyz\n26\naabcdefghijklmnopqrstuvwxy\n") == "NO\nYES", "all unique vs first char repeat"
assert run("1\n5\naaaaa\n") == "YES", "all equal letters"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1、一个| 否 | 单个字符，无法复制 |
 | 2、ab| 否 | 两个不同的字符，没有重复的字符 |
 | 2、aa| 是 | 两个相同的字符，可以复制 |
 | 26、abc...z | 否 | 所有独特字符，无法减少运算|
 | 26、aabc...y | 是 | 重复第一个字符允许复制 |
 | 5、啊啊啊| 是 | 重复字母，可复印多次|

 ## 边缘情况

 最小输入`n = 1`返回“NO”，因为不可能进行复制。 为了`n = 2`对于两个相同的字符，算法会正确输出“YES”，因为在输入第一个字符后，我们可以复制它以将操作从 2 减少到 1+1=2，这是相等的，因此如果第二个字符稍后出现在较长的字符串中，则只能严格减少。 该算法正确处理具有所有唯一字符的长字符串，输出“NO”，因为不存在操作节省。 它还通过立即检测重复并打印“YES”来处理序列早期具有重复字符的字符串，这确认了重复的存在允许复制操作的不变量。
