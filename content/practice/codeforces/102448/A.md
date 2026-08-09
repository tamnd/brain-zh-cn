---
title: "CF 102448A - 接受或拒绝"
description: "我们有一个长度为 N 的字符串 S，我们需要确定至少一个恰好有 M 个字符的连续子串从左到右和从右到左读起来是否相同。"
date: "2026-08-08T11:57:32+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102448
codeforces_index: "A"
codeforces_contest_name: "UFPE Starters Final Try-Outs 2020"
rating: 0
weight: 102448
solve_time_s: 436
verified: true
draft: false
---

[CF 102448A - 接受或拒绝](https://codeforces.com/problemset/problem/102448/A)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 16s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个字符串`S`长度`N`，并且我们需要确定是否至少有一个连续的子串正好`M`字符从左到右和从右到左读起来都是一样的。 

例如，如果`S = "ajabbaaksj"`和`M = 4`, 子串`"abba"`是回文，所以答案是`Accept`。 子串不必从任何特定位置开始，并且可能有许多候选窗口。 我们只需要一个长度准确的有效回文`M`。 

这些界限使得直接的方法无法使用。 自从`N`可以达到`5 * 10^5`，一种检查的算法`M`每个粗略的字符`N`可能的起始位置可以执行大约`N * M`人物比较。 在最坏的情况下，与`N = M = 5 * 10^5`，这大约是`2.5 * 10^11`比较，远远超出了一秒的限制。 我们需要一个运行时间是线性或接近线性的解决方案`N`。 

有一些边界情况很容易处理不当。 什么时候`M = 1`，每个字符都是回文，所以答案一定是`Accept`。 例如，`N = 1`,`M = 1`,`S = "a"`给出`Accept`。 仅检查中心位于两个字符之间的回文的解决方案将错误地拒绝这种情况。 

奇偶性为`M`也很重要。 偶数回文，例如`"abba"`其中心位于两个字符之间，而奇怪的回文，例如`"aba"`以角色为中心。 例如，`N = 3`,`M = 3`,`S = "aba"`给出`Accept`。 仅处理偶数长度中心的实现将会错过它。 

回文也可以恰好在字符串的边界处开始或结束。 例如，`N = 4`,`M = 4`,`S = "abba"`给出`Accept`。 任何需要候选中心两侧都有字符的索引方案都可能会意外地丢弃这个有效的回文。 

最后，回文长度大于`M`足以回答`Accept`，因为每个正确长度的前缀或后缀不一定是回文，但回文包含每个长度的回文子串，其奇偶性与其中心周围的长度相同。 更直接地，该算法必须检查回文数是否恰好为`M`存在，而不是简单地找到一个任意的长回文。 例如，`S = "abcba"`和`M = 4`必须被拒绝，因为它唯一的长度为 5 的回文不包含长度为 4 的回文。 这就是为什么请求长度的奇偶校验不能被忽略的原因。 

## 方法

 直接的做法是枚举每个长度的子串`M`并检查它是否与其相反。 有`N - M + 1`这样的子串。 检查一个子串需要`O(M)`时间，因为在最坏的情况下，我们可能需要比较大约一半的字符才能发现不匹配，所以总数是`O((N - M + 1)M)`，即`O(NM)`在最坏的情况下。 和`N = M = 5 * 10^5`，这大约可以达到`2.5 * 10^11`人物比较。 蛮力方法是正确的，因为它明确地测试了每个可能的候选者，但重复工作量太大。 

有用的观察是我们实际上并不单独关心每个可能的子串。 回文完全由其中心和半径来表征。 如果我们知道对于每个位置，回文围绕该中心延伸多远，那么我们可以立即回答固定长度的问题。 

有两种中心。 奇数长度回文以一个字符为中心，偶数长度回文以两个字符之间的间隙为中心。 Manacher 算法在线性时间内计算每个可能中心的最大回文半径。 一旦知道了这些半径，检查长度是否为回文`M`存在变成简单的扫描。 

对于一个奇怪的`M`，长度的回文`M`有半径`(M + 1) // 2`在通常的 Manacher 表示中，半径计算中心字符本身。 对于一个均匀的`M`，其半长为`M // 2`，并且相应的偶数中心半径必须至少为该值。 

暴力方法之所以有效，是因为它独立地验证每个窗口。 它失败了，因为相邻窗口重复了几乎所有相同的比较。 Manacher 的算法通过重用有关已知回文间隔的信息来消除这种重复。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(NM)`|`O(1)`| 太慢了 |
 | 马纳彻 |`O(N)`|`O(N)`| 已接受 |

 ## 算法演练

 1. 通过在每对字符之间以及两端插入分隔符来构建转换后的字符串。 例如，`"abba"`变成`"#a#b#b#a#"`。 这为每个回文提供了统一的中心表示，因此奇数和偶数长度可以由相同的半径数组处理。 
2. 对转换后的字符串运行 Manacher 算法。 对于每个变换位置`i`， 店铺`p[i]`, 可以左右对称匹配的字符数`i`。 该算法维护当前已知的最右边的回文及其中心。 如果新位置位于该回文内部，则可以从其镜像位置复制其初始半径，并受当前右边界限制。 只有超出该边界的字符才需要显式比较。 
3. 检查每个半径足以满足回文长度的变换中心`M`。 在变换后的表示中，原始长度的回文`M`对应于变换后的回文半径至少为`M`。 因此，如果有的话`p[i] >= M`，答案是`Accept`。 
4.如果没有变换中心至少有半径`M`， 输出`Reject`。 由于每个原始子串回文在转换后的字符串中都有相应的中心，因此不会错过任何候选者。 

转换后的表示起作用的原因是每个原始字符和每个分隔符占据交替的位置。 一个回文数`M`原始字符的跨度正好`2M`围绕其中心变换边缘，因此变换半径为`M`恰好足以包含这样的子字符串。 

### 为什么它有效

 对于每一个可能的中心，`p[i]`表示围绕该中心的最大对称区域，即回文。 原始字符串中的每个回文都有这些变换中心之一，无论其长度是奇数还是偶数。 长度-`M`因此，当某个中心至少变换半径时，回文就存在`M`。 Manacher 正确计算所有这些最大半径，因此扫描它们不会错过现有的回文或接受非回文。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    N, M = map(int, input().split())
    S = input().strip()

    # Transform the string so odd and even palindromes
    # are handled uniformly.
    T = "#" + "#".join(S) + "#"
    n = len(T)

    p = [0] * n
    center = 0
    right = 0

    for i in range(n):
        mirror = 2 * center - i

        if i < right:
            p[i] = min(right - i, p[mirror])

        while (
            i - p[i] - 1 >= 0
            and i + p[i] + 1 < n
            and T[i - p[i] - 1] == T[i + p[i] + 1]
        ):
            p[i] += 1

        if i + p[i] > right:
            center = i
            right = i + p[i]

    for radius in p:
        if radius >= M:
            print("Accept")
            return

    print("Reject")

if __name__ == "__main__":
    solve()
```转换会在每个原始字符之间创建分隔符。 这就是回文数的原因，例如`"aba"`和一个诸如`"abba"`看起来结构与 Manacher 的算法相同。 它们的中心只是不同的变换位置。 

这`p`数组存储每个变换位置周围的最大半径。`center`和`right`描述迄今为止处理的回文中最右边的回文。 什么时候`i < right`，周围的回文`i`有一个镜像位置`2 * center - i`。 它的已知半径为我们提供了一个有效的起始值`p[i]`，因此我们不会重复其他地方已经进行的比较。 

扩展循环在转换字符串的两侧受到保护。 这可以避免当回文到达数组的任一端时访问数组外部的位置`S`。 Python 整数不会溢出，因此不需要对半径或索引进行特殊处理。 

最终的条件是`radius >= M`， 不是`radius == M`。 仅当所请求的长度具有适当的奇偶性时，较大的回文数才可能包含所请求长度的回文数，因此这一点值得关注。 然而，在变换后的表示中，半径为`R`表示所有原始回文长度`1`通过`R`具有相应的中心结构，半径至少为`M`正是长度为原始回文的条件`M`围绕那个中心。 

## 工作示例

 ### 示例 1

 输入是：```
10 4
ajabbaaksj
```变换后的字符串是`#a#j#a#b#b#a#a#k#s#j#`。 相关中心是两者之间的分隔符`b`人物。 它的半径在转换后的表示中每侧达到四个原始字符，足以覆盖`"abba"`。 

| 中心| 人物 | 半径`p[i]`|`p[i] >= M`|
 | ---| ---| ---| ---|
 | 1 |`a`| 1 | 没有 |
 | 3 |`j`| 1 | 没有 |
 | 5 |`a`| 1 | 没有 |
 | 7 |`b`| 1 | 没有 |
 | 9 |`#`| 4 | 是的 |

 两者之间分隔线的中心`b`字符对应于`"abba"`。 由于其变换半径至少为`4`，算法打印`Accept`。 

### 构造示例

 考虑：```
5 4
abcba
```该字符串有一个回文长度`5`，但没有长度的回文`4`。 变换后的字符串是`#a#b#c#b#a#`。 最大半径出现在中心字符处`c`。 

| 中心| 人物 | 半径`p[i]`|`p[i] >= 4`|
 | ---| ---| ---| ---|
 | 1 |`a`| 1 | 没有 |
 | 3 |`b`| 1 | 没有 |
 | 5 |`c`| 5 | 是的 |

 这个表暴露了一个微妙的点。 中心有半径`5`，所以算法很简单`p[i] >= M`测试似乎接受`M = 4`。 这对于原始长度的解释是不正确的。 变换后的半径为`5`对应于原始回文长度`5`，而围绕同一中心的下一个较小的回文具有长度`3`， 不是`4`。 

因此，实现必须区分奇偶校验`M`在解释马纳赫的变换半径时。 因此，上面的代码需要进行奇偶校验最终检查。 下面给出了更正后的实现。```python
import sys
input = sys.stdin.readline

def solve():
    N, M = map(int, input().split())
    S = input().strip()

    T = "#" + "#".join(S) + "#"
    n = len(T)

    p = [0] * n
    center = 0
    right = 0

    for i in range(n):
        mirror = 2 * center - i

        if i < right:
            p[i] = min(right - i, p[mirror])

        while (
            i - p[i] - 1 >= 0
            and i + p[i] + 1 < n
            and T[i - p[i] - 1] == T[i + p[i] + 1]
        ):
            p[i] += 1

        if i + p[i] > right:
            center = i
            right = i + p[i]

    # In the transformed string:
    # odd original length M has a character at the center,
    # even original length M has a separator at the center.
    if M % 2 == 1:
        needed = M
        for i in range(1, n, 2):
            if p[i] >= needed:
                print("Accept")
                return
    else:
        needed = M
        for i in range(0, n, 2):
            if p[i] >= needed:
                print("Accept")
                return

    print("Reject")

if __name__ == "__main__":
    solve()
```转换后的位置在原始字符和分隔符之间交替。 字符中心出现在奇数索引处，而分隔符中心出现在偶数索引处。 因此，必须仅在字符中心检查奇数长度回文，仅在分隔符中心检查偶数长度回文。 这消除了奇偶校验错误，如下所示`"abcba"`和`M = 4`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(N)`| 变换后的字符串有`2N + 1`位置，而马纳赫的扩张仅推进右边界`O(N)`次。 |
 | 空间|`O(N)`| 转换后的字符串和回文半径数组都包含`O(N)`元素。 |

 和`N <= 5 * 10^5`，变换后的字符串最多包含`1,000,001`职位。 运行时间和内存使用量都呈线性增长，因此该解决方案适合 1 秒和 256 MB 的限制。 

## 测试用例```python
import sys
import io

def solve():
    N, M = map(int, input().split())
    S = input().strip()

    T = "#" + "#".join(S) + "#"
    n = len(T)

    p = [0] * n
    center = 0
    right = 0

    for i in range(n):
        mirror = 2 * center - i

        if i < right:
            p[i] = min(right - i, p[mirror])

        while (
            i - p[i] - 1 >= 0
            and i + p[i] + 1 < n
            and T[i - p[i] - 1] == T[i + p[i] + 1]
        ):
            p[i] += 1

        if i + p[i] > right:
            center = i
            right = i + p[i]

    if M % 2 == 1:
        for i in range(1, n, 2):
            if p[i] >= M:
                print("Accept")
                return
    else:
        for i in range(0, n, 2):
            if p[i] >= M:
                print("Accept")
                return

    print("Reject")

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_input = input

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    out = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = out

    try:
        solve()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = old_input

    return out.getvalue().strip()

assert run("10 4\najabbaaksj\n") == "Accept", "sample 1"

assert run("1 1\na\n") == "Accept", "minimum-size input"

assert run("4 4\nabba\n") == "Accept", "whole string is an even palindrome"

assert run("5 4\nabcba\n") == "Reject", "odd palindrome must not satisfy even length"

assert run("5 5\nabcba\n") == "Accept", "whole string is an odd palindrome"

assert run("6 3\nxxabcy\n") == "Reject", "no length-3 palindrome"

assert run("6 3\naabbcc\n") == "Accept", "boundary length-3 palindrome"

assert run("500000 500000\n" + "a" * 500000 + "\n") == "Accept", \
    "maximum-size all-equal string"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 / a`|`Accept`| 最小尺寸和`M = 1`|
 |`4 4 / abba`|`Accept`| 甚至回文占据整个字符串 |
 |`5 4 / abcba`|`Reject`| 正确的奇偶校验处理 |
 |`5 5 / abcba`|`Accept`| 奇数回文占据整个字符串 |
 |`6 3 / xxabcy`|`Reject`| 没有候选回文 |
 |`6 3 / aabbcc`|`Accept`| 边界附近的回文 |
 |`500000 500000 / a...a`|`Accept`| 最大输入大小和重复字符 |

 ## 边缘情况

 当`M = 1`，每个字符本身都是回文。 对于输入```
1 1
a
```转换后的字符串是`#a#`，并且字符中心有半径`1`。 自从`M`是奇数，算法检查字符中心并立即找到`p[i] >= 1`，生产`Accept`。 

对于字符串开头或结尾的偶数回文，中心是分隔符而不是字符。 和```
4 4
abba
```转换后的字符串是`#a#b#b#a#`。 中心分隔符有半径`4`，因此偶数长度分支找到足够大的半径`M = 4`。 答案是`Accept`。 字符和分隔符中心之间的明确分隔可防止偶数回文与奇数回文混淆。 

平价案例`abcba`和`M = 4`对于捕获不正确的实现特别有用。 输入是```
5 4
abcba
```中心人物`c`已变换半径`5`。 然而，因为`M`是偶数时，算法会忽略字符中心并仅检查分隔符中心。 没有一个有半径`4`，所以结果是`Reject`。 长度为 5 的回文不会意外满足长度为 4 的查询。 

回文也可以触及字符串边界。 为了```
5 5
abcba
```整个字符串是一个回文。 它的中心是角色`c`，其半径为`5`。 自从`M`是奇数并且字符中心分支检查这个位置，算法返回`Accept`。 第一个或最后一个子字符串不需要特殊情况，因为 Manacher 的边界检查自然会处理它。 

最后，全相等最大尺寸情况强调展开逻辑和渐近复杂度：```
500000 500000
aaaaaaaaaa...aaaaaaaaaa
```每次字符比较都成功，因此找到了最大可能的回文。 尽管扩展很长，Manacher 的算法仍然以线性时间运行，因为所维护的右边界仅向前移动`O(N)`次。 结果是`Accept`。
