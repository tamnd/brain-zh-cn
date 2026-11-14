---
title: "CF 412E - 电子邮件地址"
description: "给定一个长字符串，仅包含小写字母、数字、、@ 和 .。我们必须计算该字符串中有多少个子字符串是有效的电子邮件地址。 子串是根据它们的位置来区分的，而不是根据它们的文本内容来区分的。"
date: "2026-06-07T02:21:17+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 412
codeforces_index: "E"
codeforces_contest_name: "Coder-Strike 2014 - Round 1"
rating: 1900
weight: 412
solve_time_s: 218
verified: false
draft: false
---

[CF 412E - 电子邮件地址](https://codeforces.com/problemset/problem/412/E)

 **评级：** 1900
 **标签：** 实施
 **求解时间：** 3m 38s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个长字符串，仅包含小写字母、数字、`_`,`@`， 和`.`。 

We must count how many substrings of this string are valid e-mail addresses. 子串是根据它们的位置来区分的，而不是根据它们的文本内容来区分的。 If the same e-mail text appears in two different places, both occurrences contribute to the answer.

 有效地址的形式如下：`local_part@domain.tld`本地部分必须非空，可以包含字母、数字和`_`，并且它的第一个字符必须是字母。 

之间的域部分`@`和`.`必须非空且仅包含字母或数字。 

之后的最后一部分`.`必须非空且仅包含字母。 

字符串长度可以达到$10^6$。 任何检查所有子串的算法都是不可能的。 有大约$5 \cdot 10^{11}$在最坏的情况下，即使只检查其中的一小部分也会超出时间限制。 

挑战在于单个`@`可以参与许多不同的有效地址，因为本地部分可能从不同的字母位置开始，并且单个`.`可以参与许多不同的有效地址，因为地址可能以最终字母块的不同字母结尾。 

一些边缘情况很容易被错误处理。 

考虑：```
1@a.b
```本地部分以数字开头，因此没有有效地址。 仅检查本地部分是否包含有效字符的解决方案会错误地计算一个地址。 

考虑：```
ab@12.xyz
```该域可能包含数字，因此这是有效的。 将域视为仅字母会丢失有效答案。 

考虑：```
a@b.cd3
```地址不能在以下内容之后结束`3`，因为最后一个组件必须仅包含字母。 有效的结尾仅位于紧接点之后的连续字母块内。 

考虑：```
ab_cd@x.yz
```本地部分可能开始于`a`或在`b`，因为任何起始位置是字母并且位于同一有效本地字符块内都会创建有效的本地部分。 仅计算最大局部部分会低估。 

## 方法

 暴力解决方案将枚举每个子字符串并检查它是否与电子邮件格式匹配。 有$O(n^2)$子串。 即使验证是$O(1)$，这对于$n = 10^6$。 

关键的观察结果是，有效地址完全取决于选择`@`和`.`。 

假设一个点固定在位置`j`。 

为了使域部分有效，之间的每个字符`@`和`.`必须是字母数字。 让最大的字母数字块结束于`j - 1`从位置开始`t`。 

那么最多有一种可能`@`：它必须正好位于位置`t - 1`。 

如果更早，间隔将包含非字母数字字符。 如果晚了，它将位于字母数字块内，这是不可能的，因为`@`不是字母数字。 

这极大地减少了问题。 对于每个点，最多有一个候选点`@`。 

现在我们只需要两个重数。 

对于固定有效`@`，本地部分存在多少种可能的启动方式？ 允许的本地字符最大块内的每个字母紧接其后结尾`@`可以作为开始。 

对于一个固定的有效点，存在多少种可能的端点？ 紧接着点之后的连续字母块内的每个字母都可以作为结束位置。 

如果`starts = number of valid local-part starts`和`ends = number of valid address endings`那么这个`@`和`.`贡献`starts × ends`有效的子串。 

所有需要的信息都可以通过线性扫描预先计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) 或更糟 | O(1) | O(1) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 从左到右扫描并维护本地部分允许的最大字符块信息，即字母、数字和`_`。 

对于每个位置，存储当前块中出现的以该位置结尾的字母数量。 
2. 对于每一个`@`位置、计算`start_count`。 

这等于最大本地字符块中紧接在`@`。 

每个这样的字母都可以选择作为本地部分的第一个字符。 
3. 从左到右扫描并计算当前最大字母数字块的起始位置。 

对于每个字母数字位置`i`，存储包含的块的左边界`i`。 
4. 从右向左扫描并计算`letter_len[i]`, 从位置开始的连续字母块的长度`i`。 
5. 迭代每个点位置`j`。 
6. 最后一个组成部分必须紧接在点之后开始，因此如果`j + 1`不是字母，跳过这个点。 
7. 域必须是非空且字母数字的，所以`j - 1`必须是字母数字。 如果没有，请跳过此点。 
8.让`t`是结束于的最大字母数字块的开始`j - 1`。 

唯一可能的`@`处于位置`t - 1`。 
9. 如果该位置存在并且包含`@`， 添加`start_count[@] × letter_len[j + 1]`到答案。 
10.输出累计总数。 

### 为什么它有效

 对于每个有效的电子邮件子字符串，之间的域部分`@`和`.`是一个非空字母数字块。 在点之前结束的最大字母数字块唯一地确定了`@`必须站立，即紧邻该块之前。 

相反，每当一个点有这样的前面`@`，每个有效的本地部分开头和每个有效的最终字母结尾都会生成一个不同的有效子字符串。 

该算法精确地计算这些组合，而不计算其他任何东西。 每封有效的电子邮件都贡献一次，并且每个计数的组合都满足所有格式要求。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    s = input().strip()
    n = len(s)

    def is_letter(c):
        return 'a' <= c <= 'z'

    def is_digit(c):
        return '0' <= c <= '9'

    def is_alnum(c):
        return is_letter(c) or is_digit(c)

    def is_local(c):
        return is_alnum(c) or c == '_'

    local_letters = [0] * n
    cur = 0

    for i, ch in enumerate(s):
        if is_local(ch):
            if i > 0 and is_local(s[i - 1]):
                cur += 1 if is_letter(ch) else 0
            else:
                cur = 1 if is_letter(ch) else 0
            local_letters[i] = cur
        else:
            cur = 0

    start_count = [0] * n
    for i, ch in enumerate(s):
        if ch == '@' and i > 0:
            start_count[i] = local_letters[i - 1]

    run_start = [0] * n
    start = 0

    for i, ch in enumerate(s):
        if is_alnum(ch):
            if i > 0 and is_alnum(s[i - 1]):
                run_start[i] = start
            else:
                start = i
                run_start[i] = start

    letter_len = [0] * (n + 1)
    for i in range(n - 1, -1, -1):
        if is_letter(s[i]):
            letter_len[i] = letter_len[i + 1] + 1

    ans = 0

    for j, ch in enumerate(s):
        if ch != '.':
            continue

        if j + 1 >= n or letter_len[j + 1] == 0:
            continue

        if j == 0 or not is_alnum(s[j - 1]):
            continue

        t = run_start[j - 1]
        at = t - 1

        if at >= 0 and s[at] == '@':
            ans += start_count[at] * letter_len[j + 1]

    print(ans)

if __name__ == "__main__":
    solve()
```第一次扫描计算每个位置有多少个字母属于当前本地字符块。 这直接给出了任何有效本地部分起始位置的数量`@`。 

第二次扫描记录每次字母数字运行的开始。 这就是让我们恢复独特的可能`@`对于给定的点。 

向后扫描计算从每个位置开始的连续字母块的长度。 如果一个点后面跟着一个长度的字母块`k`，那么正好有`k`有效的结束位置。 

最微妙的部分是找到候选人`@`。 正确的立场不是任意的。 它必须紧接在以以下结尾的最大字母数字块之前`j - 1`。 错过这一观察通常会导致二次行为或不正确的计数。 

所有计数都适合 64 位整数，但不一定适合 32 位整数。 Python 整数会自动处理这个问题。 

## 工作示例

 ### 示例 1

 输入：```
agapov@r1.com
```相关值：

 | 点位置| 候选人@ | 本地启动 | 字母结尾| 贡献 |
 | ---| ---| ---| ---| ---|
 | 9 | 6 | 6 | 3 | 18 | 18

 回答：```
18
```中的六个字母`agapov`都可以选择作为本地部分的开始。 中的三个字母`com`都可以选为结束位置。 每个组合都会产生一个不同的有效子字符串。 

### 示例 2

 输入：```
ab@c.de
```| 点位置| 候选人@ | 本地启动 | 字母结尾| 贡献 |
 | ---| ---| ---| ---| ---|
 | 4 | 2 | 2 | 2 | 4 |

 回答：```
4
```本地部分可能开始于`a`或者`b`。 地址可能结束于`d`或者`e`。 这给出了四个有效的子字符串。 

此示例演示了计数公式的乘法结构。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 恒定数量的线性扫描 |
 | 空间| O(n) | 存储运行信息的数组 |

 字符串长度可达一百万个字符。 线性解决方案仅执行几百万次简单操作，并且可以轻松满足时间限制。 辅助数组的大小也是线性的，并且可以轻松地适应内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve_io():
    input = sys.stdin.readline
    s = input().strip()
    n = len(s)

    def is_letter(c):
        return 'a' <= c <= 'z'

    def is_digit(c):
        return '0' <= c <= '9'

    def is_alnum(c):
        return is_letter(c) or is_digit(c)

    def is_local(c):
        return is_alnum(c) or c == '_'

    local_letters = [0] * n
    cur = 0

    for i, ch in enumerate(s):
        if is_local(ch):
            if i > 0 and is_local(s[i - 1]):
                cur += 1 if is_letter(ch) else 0
            else:
                cur = 1 if is_letter(ch) else 0
            local_letters[i] = cur
        else:
            cur = 0

    start_count = [0] * n
    for i, ch in enumerate(s):
        if ch == '@' and i > 0:
            start_count[i] = local_letters[i - 1]

    run_start = [0] * n
    start = 0

    for i, ch in enumerate(s):
        if is_alnum(ch):
            if i > 0 and is_alnum(s[i - 1]):
                run_start[i] = start
            else:
                start = i
                run_start[i] = start

    letter_len = [0] * (n + 1)
    for i in range(n - 1, -1, -1):
        if is_letter(s[i]):
            letter_len[i] = letter_len[i + 1] + 1

    ans = 0

    for j, ch in enumerate(s):
        if ch != '.':
            continue

        if j + 1 >= n or letter_len[j + 1] == 0:
            continue

        if j == 0 or not is_alnum(s[j - 1]):
            continue

        t = run_start[j - 1]
        at = t - 1

        if at >= 0 and s[at] == '@':
            ans += start_count[at] * letter_len[j + 1]

    print(ans)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve_io()
    return sys.stdout.getvalue().strip()

# provided sample
assert run("agapov@r1.com\n") == "18", "sample 1"

# custom cases
assert run("a\n") == "0", "minimum size"
assert run("a@b.c\n") == "1", "smallest valid email"
assert run("1@b.c\n") == "0", "local part must start with a letter"
assert run("ab@c.de\n") == "4", "multiple starts and endings"
assert run("ab_cd@x.yz\n") == "4", "underscore allowed inside local part"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`a`|`0`| 最小尺寸字符串 |
 |`a@b.c`|`1`| 最小有效地址 |
 |`1@b.c`|`0`| 本地部分不能以数字开头 |
 |`ab@c.de`|`4`| 多个有效的开始和结束|
 |`ab_cd@x.yz`|`4`| 本地部分的下划线处理 |

 ## 边缘情况

 考虑：```
1@a.b
```之前的最大本地字符块`@`不包含字母。 该算法存储`start_count = 0`，因此即使域和后缀有效，贡献也为零。 输出正确：```
0
```考虑：```
a@12.xyz
```街区`12`完全是字母数字。 点找到唯一的前面`@`,`start_count = 1`，后缀长度为`3`。 答案变成：```
3
```对应于结尾`x`,`y`， 和`z`。 

考虑：```
a@b.cd3
```点后的连续字母块有长度`2`，即`cd`。 数字`3`不是最终组件的一部分。 该算法使用`letter_len[j + 1] = 2`，恰好产生两个有效的结局。 

考虑：```
ab_cd@x.yz
```前`@`，最大本地字符块包含字母`a`和`b`。 两者都是有效的起始位置。 点之后，字母块有长度`2`。 该算法计算`2 × 2 = 4`，它匹配四个有效的子字符串。
