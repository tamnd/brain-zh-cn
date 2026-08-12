---
title: "CF 102700M - 魔法咒语"
description: "我们有一个参考字符串 s。 s 的每个非空子序列都被视为有效的咒语。 对于每个输入字符串 a，一些原始拼写后面跟着任意后缀，因此 a 的有用部分正是它的最长前缀，该前缀仍然可以作为子序列嵌入......"
date: "2026-08-12T19:13:57+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102700
codeforces_index: "M"
codeforces_contest_name: "2020 ICPC Universidad Nacional de Colombia Programming Contest"
rating: 0
weight: 102700
solve_time_s: 787
verified: true
draft: false
---

[CF 102700M - 魔法咒语](https://codeforces.com/problemset/problem/102700/M)

 **评级：** -
 **标签：** -
 **求解时间：** 13m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个参考字符串`s`。 的每个非空子序列`s`被认为是有效的咒语。 对于每个输入字符串`a`，一些原始拼写后面带有任意后缀，因此有用的部分`a`正是它的最长前缀，仍然可以作为子序列嵌入`s`。 

因此，该任务是一个前缀子序列问题。 从年初开始`a`，我们希望继续采用能够出现在`s`严格增加仓位。 当一个字符不能放置在前一个匹配位置之后时，前缀就不再起作用。 如果连第一个字符都无法匹配，则答案是`IMPOSSIBLE`。 

参考字符串最多有`2 * 10^5`字符，最多可以有`10^5`查询，所有修改字符串的总长度也最多为`2 * 10^5`。 最后一个界限使线性或近线性解决方案成为可能：在所有查询中，我们只需要处理`2 * 10^5`人物。 一种花费的方法`O(|s|)`对于每个查询字符的工作仍然可以达到大约`2 * 10^5 * 2 * 10^5 = 4 * 10^10`字符检查，远远超出了两秒的限制。 

第一个边缘情况是当第一个字符没有出现在`s`。 例如，```
abc
1
d
```有输出```
IMPOSSIBLE
```不存在作为子序列的非空前缀。 粗心的实现可能会打印一个空字符串，但所需的输出明确使用`IMPOSSIBLE`当无法形成非空咒语时。 

当字符存在于`s`，但不在前一个字符使用的位置之后。 例如，```
abc
1
ca
```有输出```
c
```这`c`可以匹配到最后一个位置，但是没有`a`在它之后。 仅检查每个字符是否出现在`s`会错误地接受`ca`。 

第三种边缘情况是整个输入字符串是有效子序列。 例如，```
abc
1
abc
```有输出```
abc
```该算法不得要求查询包含额外的修改后缀。 查询已经可以完全是原始咒语。 

第四种边缘情况是重复字符。 例如，```
aaa
2
aaaa
ba
```有输出```
aaa
IMPOSSIBLE
```第一个查询可以使用所有三个出现的`a`，但第四个不能放置。 第二个查询立即失败，因为`b`永远不会发生。 当顺序和多重性很重要时，将字符存在视为布尔值是不够的。 

## 方法

 直接的解决方案是独立处理每个查询并模拟子序列的定义。 保留一个指针`s`。 对于查询的每个字符，向前扫描`s`直到找到该字符。 如果找到，请将指针移过它并继续。 如果结束时`s`首先到达，停止并返回到目前为止匹配的前缀。 

这种蛮力方法是正确的，因为子序列是通过选择增加的位置来精确定义的。`s`。 对于每个查询字符，选择其第一个可用的出现位置是最佳的：选择较晚的出现位置只能为其余字符留下更少的可用位置。 问题是它的运行时间。 单个字符可能需要扫描几乎所有字符`s`，这对于许多查询来说可以独立发生。 和`|s| = 2 * 10^5`和总查询长度`2 * 10^5`，最坏的情况约为`4 * 10^10`人物比较。 

有用的观察是，暴力破解的昂贵部分是重复搜索相同的固定字符串`s`。 字符串在查询之间永远不会改变，因此有关字符出现位置的所有信息都可以准备一次。 

对于每个小写字符，存储它出现的位置的排序列表`s`。 假设之前匹配的位置是`p`下一个查询字符是`c`。 我们需要第一次出现`c`其位置大于`p`。 由于出现列表已排序，因此这正是对大于的第一个位置的二分搜索`p`。 

这会改变扫描中的每个字符查找`s`在出现的一个字符中进行二分查找。 由于只有`2 * 10^5`查询字符总数，整个计算变成`O(|s| + L log |s|)`， 在哪里`L`是所有查询的总长度。 有了这些限制，这很容易足够快。 

同样的想法也可以通过完整的下次出现表来实现，给出`O(|s| + L)`时间，但在 Python 中，这样的表会消耗更多的内存，因为它在每个位置存储 26 个字符的信息。 事件列表更加简单并且能够轻松满足限制。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O( | s | * L)`在最坏的情况下|`O(1)`除了输入| 太慢了|
 | 出现列表+二分查找|`O( | s | + L log | s | )`|`O( | s | )`| 已接受 |

 ## 算法演练

 1. 阅读`s`并建立 26 个出现列表。 对于每个职位`i`在`s`, 追加`i`到属于的列表`s[i]`。 由于位置是从左到右处理的，因此每个列表都会自动排序。 
2. 处理每个修改过的法术`a`独立。 放`pos = -1`，这意味着没有字符`a`尚未匹配。 还为答案创建一个空列表。 
3.对于每个角色`c`在`a`，取属于的出现列表`c`并二分搜索严格大于的第一个位置`pos`。 这是最早出现的地点`c`可以在保留子序列顺序的同时进行放置。 
4. 如果不存在这样的位置，则停止处理该查询。 每个较长的前缀都包含相同的不匹配字符，因此它也不可能是子序列。 
5. 如果该职位存在，则追加`c`到答案并更新`pos`到那个事件的发生。 选择最早可能的出现留下最大可能的后缀`s`可用于以后的角色。 
6. 处理完查询后，如果不为空则打印匹配的前缀。 如果第一个字符已经失败，则答案列表为空，因此打印`IMPOSSIBLE`。 

### 为什么它有效

 不变量是在处理完第一个之后`k`查询的字符，`pos`是最早可能的位置`s`该前缀可以结束。 最初确实如此，因为没有匹配的字符。 当处理下一个字符时，二分查找选择它之后最早出现的字符`pos`，因此新位置又是最早可能的结束位置。 

如果该事件不存在，则无法在前一个前缀的任何有效放置之后放置下一个字符。 由于我们已经尽早保留了之前的角色，选择其他的位置只能是向右移动，并没有什么帮助。 因此，当前前缀是最长的有效前缀，并且不再有前缀可以是咒语。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from bisect import bisect_right

def solve():
    s = input().strip()
    n = int(input())

    positions = [[] for _ in range(26)]

    for i, ch in enumerate(s):
        positions[ord(ch) - ord('a')].append(i)

    output = []

    for _ in range(n):
        a = input().strip()

        pos = -1
        answer = []

        for ch in a:
            occ = positions[ord(ch) - ord('a')]

            # First occurrence strictly after pos.
            idx = bisect_right(occ, pos)

            if idx == len(occ):
                break

            pos = occ[idx]
            answer.append(ch)

        if answer:
            output.append(''.join(answer))
        else:
            output.append("IMPOSSIBLE")

    sys.stdout.write('\n'.join(output))

if __name__ == "__main__":
    solve()
```这`positions`array 包含每个小写字母的一个排序列表。 例如，如果`s = "abracadabra"`，列表为`a`包含所有索引`a`出现，按升序排列。 

对于每个查询，`pos`代表位置在`s`由最后一个成功匹配的字符使用。 它开始于`-1`，所以第一个字符允许使用位置`0`。 

微妙的操作是`bisect_right(occ, pos)`。 我们需要一个严格大于的位置`pos`，不大于或等于它，因为两个子序列字符必须使用不同的位置。 如果`pos`是`4`下一个字符出现在以下位置`4, 7, 9`，正确的选择是`7`， 所以`bisect_right`准确给出所需的索引。 

当二分查找返回时`len(occ)`，在上一场比赛之后没有有效的出现。 我们立即停止，因为答案必须是前缀。 继续检查后面的字符无法生成有效的较长前缀。 

Python中不存在整数溢出问题，并且位置值永远不会超过`len(s) - 1`。 输出累积在列表中并在最后写入一次，避免重复刷新或昂贵的输出操作。 

## 工作示例

 对于提供的示例，参考字符串是`abracadabra`。 

查询`abra`可以完全匹配。 查询`cadabra`也可以完全匹配，同时`dcba`只能匹配其第一个字符，因为在选择之后`d`没有`c`。 

| 查询字符 | 考虑的事件 | 上一个位置 | 选择的位置 | 匹配的前缀 |
 | --- | --- | --- | --- | --- |
 |`a`|`a`职位|`-1`|`0`|`a`|
 |`b`|`b`职位|`0`|`1`|`ab`|
 |`r`|`r`职位|`1`|`2`|`abr`|
 |`a`|`a`职位|`2`|`3`|`abra`|

 为了`dcba`，第一个`d`发现接近尾声`s`。 一旦选择了该位置，就可以进行下一次搜索`c`没有有效位置，因此算法停止并返回`d`。 

| 查询字符 | 上一个位置 | 选择的位置 | 结果 |
 | --- | --- | --- | --- |
 |`d`|`-1`|`6`|`d`|
 |`c`|`6`| 无 | 停止|

 完整的样品产生`abra`,`cadabra`,`abcd`,`d`， 和`IMPOSSIBLE`，匹配所需的输出。 

第二个示例演示了重复的字符和仅出现在上一个匹配项之前的字符。```
abcba
4
abba
cba
bbbbb
ac
```结果是：```
abba
cba
bb
ac
```为了`abba`，选择的位置是`0, 1, 3, 4`，所以整个字符串都是有效的。 

| 查询字符 | 上一个位置 | 选择的位置 | 匹配的前缀 |
 | --- | --- | --- | --- |
 |`a`|`-1`|`0`|`a`|
 |`b`|`0`|`1`|`ab`|
 |`b`|`1`|`3`|`abb`|
 |`a`|`3`|`4`|`abba`|

 为了`bbbbb`, 只有两个`b`字符可以匹配，因为`s`仅包含两次出现`b`。 

| 查询字符 | 上一个位置 | 选择的位置 | 匹配的前缀 |
 | --- | --- | --- | --- |
 |`b`|`-1`|`1`|`b`|
 |`b`|`1`|`3`|`bb`|
 |`b`|`3`| 无 | 停止|

 该跟踪说明了为什么算法必须搜索前一个位置之后的下一个出现位置，而不是仅仅检查该字符是否出现在`s`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O( | s | + L log | s | )`| 构建事件列表成本`O( | s | )`，以及每个`L`查询字符执行一次二分查找。 |
 | 空间|`O( | s | )`| 每个位置的`s`除了输入和输出存储之外，仅出现在一个出现列表中。 |

 这里`L`是所有修改过的咒语的总长度，并且问题保证`L <= 2 * 10^5`和`|s| <= 2 * 10^5`。 预处理是线性的，而二分搜索仅针对实际出现在输入查询中的字符执行。 这使解决方案能够轻松地保持在规定的两秒和 512 MB 限制内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from bisect import bisect_right

def solve():
    input = sys.stdin.readline

    s = input().strip()
    n = int(input())

    positions = [[] for _ in range(26)]

    for i, ch in enumerate(s):
        positions[ord(ch) - ord('a')].append(i)

    out = []

    for _ in range(n):
        a = input().strip()

        pos = -1
        answer = []

        for ch in a:
            occ = positions[ord(ch) - ord('a')]
            idx = bisect_right(occ, pos)

            if idx == len(occ):
                break

            pos = occ[idx]
            answer.append(ch)

        out.append(''.join(answer) if answer else "IMPOSSIBLE")

    sys.stdout.write('\n'.join(out))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert run(
    """abracadabra
5
abra
cadabra
abcd
dcba
magic
"""
) == """abra
cadabra
abcd
d
IMPOSSIBLE""", "sample 1"

# Minimum-size input
assert run(
    """a
1
a
"""
) == "a", "minimum-size valid spell"

# All equal characters, including one character too many
assert run(
    """aaaa
3
aaaaa
aa
b
"""
) == """aaaa
aa
IMPOSSIBLE""", "repeated characters"

# Boundary and ordering cases
assert run(
    """abc
5
abc
abca
c
ac
bc
"""
) == """abc
abc
c
ac
bc""", "boundary positions and subsequence order"

# Maximum n and maximum total query length.
# The reference string and all queries use the same character.
s = "a" * 100000
queries = "\n".join(["a"] * 100000)
large_input = s + "\n100000\n" + queries + "\n"
large_output = ("a\n" * 99999) + "a"

assert run(large_input) == large_output, "large input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a / 1 / a`|`a`| 尽可能小的参考字符串和查询。 |
 |`aaaa / aaaaa, aa, b`|`aaaa`,`aa`,`IMPOSSIBLE`| 重复的字符、令人筋疲力尽的出现以及缺少第一个字符。 |
 |`abc / abc, abca, c, ac, bc`|`abc`,`abc`,`c`,`ac`,`bc`| 精确匹配、无效后缀、第一个/最后一个位置和有序子序列。 |
 |`100000`的副本`a`在两者中`s`和查询|`100000`行包含`a`| 最大查询数和大的总输入大小。 |

 ## 边缘情况

 当第一个字符不存在时，算法查看其出现列表并立即发现它为空。 为了```
abc
1
d
```的列表`d`长度为零，所以`bisect_right`返回零并且算法打印`IMPOSSIBLE`。 不会发出任何空字符串。 

当所需字符仅在上一个匹配之前存在时，二分搜索会正确忽略这些出现的情况。 为了```
abc
1
ca
```

`c`匹配位置`2`。 出现列表为`a`仅包含位置`0`，并搜索大于的位置`2`失败。 因此，存储的答案是`c`。 

当查询长度超过可用重复字符的数量时，二分搜索自然会耗尽出现次数。 为了```
aaa
1
aaaa
```前三个搜索选择位置`0`,`1`， 和`2`。 第四次搜索找不到大于的位置`2`，所以答案是`aaa`。 

当查询已经是有效子序列时，不需要特殊处理。 为了```
abc
1
abc
```搜索选择职位`0`,`1`， 和`2`，并返回整个查询。 

二分查找中的边界条件是严格的。 认为`s = "ab"`查询是`bb`。 第一个`b`使用位置`1`。 第二次搜索必须寻找大于的位置`1`，不大于或等于`1`。 由于不存在这样的位置，因此结果就是`b`。 重用位置`1`将是一个无效的子序列，并且是该解决方案中最常见的差一错误。 

最后，如果查询在第一个不可能的字符之后包含任意字符，则决不能考虑这些字符。 例如，```
abc
1
adzzzz
```有答案`a`。 一次`d`失败，每个较长的前缀也包含无效的`d`，所以处理`z`,`z`,`z`,`z`无法改变答案。 这正是为什么停在第一个失败字符处会给出最长的有效前缀。
