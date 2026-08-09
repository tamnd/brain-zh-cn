---
title: "CF 102470J - 结巴的外星人"
description: "对于每个测试用例，我们有一个小写字符串 s 和一个整数 m。 我们需要找到在 s 中至少出现 m 次的最长连续子串。 允许出现重叠。"
date: "2026-08-09T15:38:29+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102470
codeforces_index: "J"
codeforces_contest_name: "2009-2010 ACM ICPC Southwestern European Regional Programming Contest (SWERC 2009)"
rating: 0
weight: 102470
solve_time_s: 458
verified: true
draft: false
---

[CF 102470J - 结巴的外星人](https://codeforces.com/problemset/problem/102470/J)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个测试用例，我们都有一个小写字符串`s`和一个整数`m`。 我们需要找到至少出现的最长连续子串`m`次在`s`。 允许出现重叠。 如果几个子串的最大长度相同，我们就不需要识别子串本身。 我们输出任何最佳子串的所有出现中的最大起始位置。 

输入包含多个独立的测试用例。 测试用例的第一行给出`m`，后跟消息字符串。 一行包含`m = 0`终止输入。 字符串长度介于`m`和`40000`，因此即使单个测试用例可能足够大，枚举所有子字符串并直接比较它们也是不可行的。 原问题有 1 秒时间限制和 256 MB 内存限制。 

重叠条件排除了将事件视为不相交的方法。 例如，与`s = "ababa"`和`m = 2`, 子串`aba`发生在位置`0`和`2`。 两个事件共享中间`a`，但两者都算。 正确的输出是`3 2`。 在找到一个事件后跳转到事件末尾的实现会错误地错过第二个事件。 

案例`m = 1`是另一个边界条件。 每个子串至少出现一次，因此整个字符串自动是最佳的。 为了`m = 1`和`s = "abc"`，答案是`3 0`。 仅围绕重复子字符串设计的解决方案可能会错误地打印`none`因为它预计会出现两次或两次以上。 

也不能有有效的非空子字符串。 例如，与`m = 3`和`s = "abc"`，每个单字符子字符串仅出现一次，因此任何内容都不能出现三次。 正确的输出是`none`。 粗心的实施可能会对待这样一个事实：`n >= m`足够并且错误地输出长度为一的子字符串。 

最后，最右出现规则与最大长度无关。 和`m = 2`和`s = "ababa"`， 两个都`aba`其出现次数的最佳长度为 3，最右边的出现次数从位置开始`2`。 返回第一个最佳出现位置`0`，给出了错误的答案。 

## 方法

 直接解决方案首先考虑每个可能的子字符串。 有`n(n+1)/2`位置和长度不同，所以有 θ(`n²`）候选人。 对于每个候选者，我们可以将其与字符串中每个可能的起始位置进行比较，并且比较可以检查 θ(`n`) 最坏情况下的字符。 对于诸如长串相等字符之类的字符串，几乎每次比较都会在发现不匹配之前到达末尾。 因此总功为 θ(`n⁴`），通过前导比较解决`n⁴ / 12`。 在`n = 40000`，这已经远远超出了时间限制。 即使我们通过哈希改进子串比较，简单的候选枚举仍然是二次的。 

问题的结构表明了更强的代表性。 我们对子串之间的任意关系不感兴趣。 我们关心每个子串的两个属性：它的长度和它结束的所有位置。 后缀自动机根据子串的结束位置（称为子串）精确分组`endpos`放。 一种状态所代表的所有子串的出现位置完全相同，而它们的长度则形成一个连续的区间`len(link[v]) + 1`通过`len[v]`。 这正是这里需要的信息。 

假设一个州`v`有`len[v] = 10`其出现次数至少为`m`。 那么该状态所表示的最长子串的长度为十，并且已经满足重复要求。 我们不必检查同一状态表示的所有较短字符串，因为它们无法改进答案。 如果几个州有相同的最大值`len`， 他们的`endpos`集合告诉我们它们最长的代表出现在哪里，因此我们也可以选择最右边的起始位置。 

每个状态的出现计数可以通过以下方式计算：首先为每个新创建的非克隆状态分配一次出现，为克隆分配零，然后沿后缀链接以递减的方式传播计数`len`命令。 相同的传播可以携带最大结束位置。 这是标准后缀自动机出现计数技术。 

生成的算法与字符串长度呈线性关系。 后缀自动机最多有`2n - 1`状态，对于固定的小写字母表，其结构是线性的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n⁴) | O(n) 辅助 | 太慢了 |
 | 最优后缀自动机 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 构建一个后缀自动机，同时从左到右读取字符串。 各州商店`len`、其后缀链接、其传出转换、出现计数器以及当前已知的该状态的最大结束位置。 为新附加的字符创建的状态从出现次数为 1 开始，结束位置等于当前索引。 

当现有转变指向其表示长度太大的状态时，自动机可以创建克隆。 克隆复制旧状态的转换和后缀链接，但从出现次数为零开始，因为创建克隆不会引入新的出现。 
2. 构建完成后，计算有多少个状态具有每种可能的长度。 使用计数排序来获取递增的所有状态`len`命令。 由于每个州都有`0 <= len <= n`，这种排序是线性的而不是基于比较的。 

我们稍后需要减小长度，因为状态的后缀链接父级总是具有较小的长度`len`。 在父母之前处理孩子可以让每个州积累的信息准确地到达其父母一次。 
3. 遍历递减状态`len`。 对于每个非根状态`v`，首先检查其累计出现次数。 如果`occ[v] >= m`，表示的最长子串`v`是一个有效的候选者并且有长度`len[v]`。 
4. 对于符合条件的状态，从其最大结束位置计算其最右侧出现的位置。 如果`max_end[v]`是最大的结束索引，最长表示的子串的相应出现开始于`max_end[v] - len[v] + 1`。 

如果此长度大于当前答案，则替换两个答案值。 如果长度相等，则保留较大的起始位置。 
5. 评估状态后，将其出现次数和最大结束位置传播到其后缀链接父级。 表示的子串`v`它的所有出现都是由以下表示的后缀的出现`link[v]`，因此两条信息都必须传输。 
6. 如果没有正长度的状态到达`m`出现次数，打印`none`。 否则打印最大限定长度及其最右边的起始位置。 

### 为什么它有效

 关键的不变量是每个后缀自动机状态恰好代表一个`endpos`等价类。 相同状态表示的所有子串都出现在完全相同的结束位置，并且最长的子串具有长度`len[v]`。 发生传播后，`occ[v]`正是由 表示的每个子串出现的次数`v`。 最大位置传播后，`max_end[v]`是这些事件的最右边的结束位置。 

因此，每个州`occ[v] >= m`给出一个长度有效的子串`len[v]`，并且该状态表示的子串不能更长。 每个子串都属于某个状态，因此取最大的`len[v]`在所有符合条件的状态中找到全局最长的有效子串。 在具有相同长度的状态中，`max_end[v] - len[v] + 1`恰恰是最右边的起始位置，所以平局规则也处理得恰到好处。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(m, s):
    n = len(s)

    # A suffix automaton has at most 2*n states.
    max_states = 2 * n

    transitions = [{} for _ in range(max_states)]
    length = [0] * max_states
    link = [-1] * max_states

    # occ[v] is initially 1 only for newly created states.
    # Clones keep occ = 0.
    occ = [0] * max_states

    # Largest ending position belonging to the state's endpos set.
    max_end = [-1] * max_states

    size = 1
    last = 0

    for i, ch in enumerate(s):
        c = ord(ch) - 97

        cur = size
        size += 1

        length[cur] = length[last] + 1
        occ[cur] = 1
        max_end[cur] = i

        p = last

        while p != -1 and c not in transitions[p]:
            transitions[p][c] = cur
            p = link[p]

        if p == -1:
            link[cur] = 0
        else:
            q = transitions[p][c]

            if length[p] + 1 == length[q]:
                link[cur] = q
            else:
                clone = size
                size += 1

                length[clone] = length[p] + 1
                link[clone] = link[q]
                transitions[clone] = transitions[q].copy()

                # The clone represents the same end positions as q
                # before later occurrence propagation.
                max_end[clone] = max_end[q]

                # A clone is not a newly observed occurrence.
                occ[clone] = 0

                while p != -1 and transitions[p].get(c) == q:
                    transitions[p][c] = clone
                    p = link[p]

                link[q] = clone
                link[cur] = clone

        last = cur

    # Counting sort states by len.
    count = [0] * (n + 1)
    for v in range(size):
        count[length[v]] += 1

    for i in range(1, n + 1):
        count[i] += count[i - 1]

    order = [0] * size
    for v in range(size - 1, -1, -1):
        lv = length[v]
        count[lv] -= 1
        order[count[lv]] = v

    best_len = 0
    best_pos = -1

    # Reverse order gives decreasing length.
    for idx in range(size - 1, 0, -1):
        v = order[idx]

        if occ[v] >= m:
            cur_len = length[v]
            cur_pos = max_end[v] - cur_len + 1

            if cur_len > best_len:
                best_len = cur_len
                best_pos = cur_pos
            elif cur_len == best_len and cur_pos > best_pos:
                best_pos = cur_pos

        parent = link[v]

        if parent >= 0:
            occ[parent] += occ[v]
            if max_end[v] > max_end[parent]:
                max_end[parent] = max_end[v]

    if best_len == 0:
        return "none"

    return f"{best_len} {best_pos}"

def solve():
    out = []

    while True:
        line = input()
        if not line:
            break

        m = int(line)
        if m == 0:
            break

        s = input().strip()
        out.append(solve_case(m, s))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```施工保持`last`，对应于到目前为止处理的整个前缀的状态。 当添加一个新字符时，`cur`代表新的最长前缀。 第一个后缀链接循环将新的转换添加到以前没有的每个后缀状态。 

过渡冲突有两种可能性。 如果`len[p] + 1 == len[q]`，现有状态`q`已经具有所需的长度，所以`cur`可以直接链接到它。 否则，`q`表示子串长度范围太宽。 克隆分裂的范围为`len[p] + 1`，之后两者`cur`和`q`可以使用克隆作为后缀链接目标。 

克隆人收到一份副本`q`的转变。 它的出现计数器保持为零，因为克隆改变了自动机结构，而没有在原始字符串中添加新位置。 稍后通过后缀链接传播来恢复出现的情况。 这种区别是后缀自动机实现不正确的常见原因。 

这`max_end`数组遵循相同的传播规则`occ`。 如果状态包含在位置结束的事件`i`，由其后缀链接祖先表示的每个后缀也以结尾处出现`i`。 处理较大的状态`len`变小`len`使得单个前向传播就足够了。 

表达式`max_end[v] - length[v] + 1`是由下式表示的最长子串的起始位置`v`在其最右边的结束位置。 索引从零开始，匹配所需的输出。 

使用计数排序而不是 Python 的比较排序，因为状态长度是零到之间的整数`n`。 这使整个算法保持线性。 Python 中不可能出现整数溢出，最大状态数如下`80000`为了`n <= 40000`。 

## 工作示例

 ### 示例 1

 实际样本使用`m = 3`和`baaaababababbababbab`后缀自动机扫描的重要部分是表示的状态`babab`。 其最长表示子串的长度为 5，出现次数为 3。 它最右边的结束位置是`16`，对应起始位置`16 - 5 + 1 = 12`。 

| 舞台| 表示的字符串 | 长度 | 事件 | 最右端 | 当前答案 |
 | ---| ---| ---| ---| ---| ---|
 | 初始| 空字符串 | 0 | 20 | 19 | 19`0, -1`|
 | 找到候选人 |`babab`| 5 | 3 | 16 | 16`5, 12`|
 | 后来的状态 | 更长的子串 | >5 | <3 | 变化 |`5, 12`|
 | 决赛| 最佳有效状态| 5 | 3 | 16 | 16`5, 12`|

 该状态为`babab`足以解释答案。 它的三个结束位置对应于开始`5`,`7`， 和`12`，所以最右边的出现正是位置`12`。 三个出现重叠的事实是自然处理的，因为出现计数基于结束位置，而不是不相交的间隔。 官方样品证实了结果`5 12`。 

### 示例 2

 第二个示例使用相同的字符串，但是`m = 11`。 最常见的单个字符仅出现十次，因此非空子字符串不能出现十一次。 每个较长的子字符串最多出现与其第一个字符一样多的出现次数，因此它也不能达到 11 个。 

| 舞台| 相关数量 | 价值|
 | ---| ---| ---|
 | 输入 | 必需出现的次数`m`| 11 | 11
 | 字符串长度 |`n`| 20 |
 | 最大计数`a`| 10 | 10
 | 最大计数`b`| 10 | 10
 | 任何长度至少为 2 | 的子串 事件 | 最多 10 个 |
 | 最终排位赛状态|`occ[v] >= 11`| 无 |
 | 输出| 结果 |`none`|

 后缀自动机的构建方式仍然与示例 1 中的构建方式完全相同，因为字符串未更改。 仅最终状态扫描期间使用的阈值发生变化。 由于没有状态的出现次数为 11 或更多，`best_len`保持为零并且程序打印`none`。 这是示例的第二个输出。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 对于固定的小写字母表，后缀自动机构造、按状态长度进行计数排序以及后缀链接传播都是线性的。 |
 | 空间| O(n) | 最多有`2n - 1`状态，并且转换结构加上状态数组的大小是线性的。 |

 和`n <= 40000`，自动机的数量少于`80000`州。 该算法仅对每个状态和转换进行恒定量的工作，因此它轻松地避免了直接子串枚举的二次或四次工作。 线性后缀自动机方法也是 SWERC 解决方案材料中通过密切相关的后缀树公式确定的方法之一。 

## 测试用例

 以下测试工具旨在放置在解决方案代码之后。 它使用`solve()`通过重定向的标准输入运行并检查完整的输出。```python
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output

    try:
        solve()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

    return output.getvalue()

# Provided samples
sample = """\
3
baaaababababbababbab
11
baaaababababbababbab
3
cccccc
0
"""

assert run(sample) == """\
5 12
none
4 2
""", "provided samples"

# Minimum-size input, m = 1.
assert run("""\
1
a
0
""") == "1 0\n", "minimum size"

# Boundary case: m = n, but the characters are not all equal.
assert run("""\
3
abc
0
""") == "none\n", "no substring occurs n times"

# Overlapping occurrences and rightmost tie-breaking.
assert run("""\
2
ababa
0
""") == "3 2\n", "overlapping occurrences"

# Maximum-size all-equal string.
s = "a" * 40000
assert run(f"""\
20000
{s}
0
""") == "20001 19999\n", "maximum size all-equal case"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / a`|`1 0`| 最小字符串长度和`m = 1`处理 |
 |`3 / abc`|`none`| 边界情况其中`m = n`但没有一个字符重复足够 |
 |`2 / ababa`|`3 2`| 重叠出现和最右边的决胜局 |
 |`20000 / a...a`40000 个字符 |`20001 19999`| 最大输入大小、高重复计数和出现位置算术 |

 ## 边缘情况

 对于`m = 1`，根本身不被视为候选，因为它代表空字符串。 每个非根状态至少出现一次，完整字符串对应的状态有`len = n`。 它最右边的结束位置是`n - 1`，所以它的起始位置为零。 为了`1`和`abc`，算法达到`best_len = 3`和`best_pos = 0`，生产`3 0`。 

对于不可能的重复阈值，请考虑`3`和`abc`。 每个字符的出现次数为一，并且每个较长的子字符串也仅出现一次。 传播后，每个非根状态都有`occ < 3`，所以答案变量仍然存在`best_len = 0`和`best_pos = -1`。 程序打印出`none`。 

对于重叠出现的情况，请考虑`2`和`ababa`。 子串`aba`结束于位置`2`和`4`，所以它的出现次数是两次。 代表其最终位置类别的状态有`len = 3`和`max_end = 4`。 起始位置是`4 - 3 + 1 = 2`, 给予`3 2`。 算法中的任何地方都没有出现不相交假设，因此可以自然地处理重叠。 

对于全相等的字符串，考虑六个副本`c`和`m = 3`。 长度为四的子串出现在开头`0`,`1`， 和`2`，而长度五只出现两次。 该状态为`cccc`长度为四，出现次数为三，最右边的结束位置为五，所以它的最右边的开始是`5 - 4 + 1 = 2`。 结果是`4 2`，匹配样本。 

对于最大尺寸的情况，取`40000`的副本`a`并要求`20000`发生。 长度的子串`L`在全等字符串中出现`40000 - L + 1`次。 至少要求`20000`出现次数给出`L <= 20001`。 最长的有效长度是`20001`，它最右边的出现开始于`40000 - 20001 = 19999`。 后缀自动机准确地产生`20001 19999`，同时进行最大允许输入和最右边位置计算。
