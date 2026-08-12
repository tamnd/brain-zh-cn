---
title: "CF 102439G - 序列探索"
description: "我们从字符串 1 开始。每个下一项都是通过从左到右读取前一项、将相等的连续数字分组并用两位数字替换每组来获得的：其长度后跟数字本身。"
date: "2026-08-10T06:52:06+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102439
codeforces_index: "G"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Semifinal"
rating: 0
weight: 102439
solve_time_s: 140
verified: true
draft: false
---

[CF 102439G - 序列探索](https://codeforces.com/problemset/problem/102439/G)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从字符串开始`1`。 每个下一项都是通过从左到右读取前一项、将相等的连续数字分组并用两位数字替换每组来获得的：其长度后跟数字本身。 例如，`13112221`由组组成`1`,`3`,`11`,`222`,`1`，这成为`11`,`13`,`21`,`32`,`11`。 

输入包含`n`、所需项的索引，以及`m`，从右端开始必须保留的位数。 当它的数量少于时，我们需要打印完整的术语`m`数字，否则只有最后一个`m`数字。 官方的限制允许`n`达到`10^18`尽管`m`至多是`1000`。 

的巨大价值`n`排除一一构建术语。 即使序列的长度也呈指数增长，通常的外观增长因子接近康威常数，大约`1.303577`。 直接模拟很久以前就可以达到天文弦`n`变得遥不可及`10^18`。 

基于后缀的解决方案必须仔细处理几种边界情况。 有输入`1 2`，第一项仅包含一位数字，所以答案是`1`， 不是`01`。 有输入`4 2`，第四项是`1211`，其最后两位数字是`11`，所以答案是`11`。 一个粗心的实现，总是格式准确`m`数字会产生`01`对于第一种情况，而在第二种情况下，采用字符串错误一侧的实现将会失败。 

当请求的后缀包含整个当前术语时，会发生另一种微妙的情况。 例如，输入`3 10`要求第三项，即`21`，所以答案是`21`。 我们不能用零填充它或发明不存在的数字。 

该序列具有使后缀易于管理的附加结构。 开始于`1`，只有数字`1`,`2`， 和`3`发生时，每个项都以原始数字结尾`1`，并且连续的相等数字永远不会形成长度为四或更多的游程。 最后一个属性意味着每次运行都可以由单个十进制计数数字表示。 

## 方法

 蛮力方法很简单。 存储整个当前字符串，从左到右扫描它，形成其运行，并构建下一个字符串。 后`n-1`迭代，取最后一个`m`人物。 这是正确的，因为它完全遵循序列的定义。 

问题在于中间字符串的大小。 如果当前长度是`L`，一次转换已经花费了`O(L)`time 并创建一个长度大致为的字符串`1.3L`。 因此，即使构建前几十个术语也需要处理数千或数百万个字符，而`n`或许`10^18`。 暴力模拟将按照所有术语长度之和的顺序执行，该术语长度是指数级的`n`，所以完全不可行。 

关键的观察是我们不需要整个术语。 我们只需要它的后缀，并且变换对于运行而言是局部的。 

通过其游程而不是其单个数字来表示术语。 运行存储为`(digit, count)`。 一次输入运行恰好产生两个输出字符，`count`和`digit`。 考虑最后一个`K`一个术语的运行。 当这些运行被转换时，它们的编码对总是至少包含`K`输出运行。 原因很简单：每个编码对的最后一位数字是相应输入运行的数字，并且连续的输入运行具有不同的数字。 因此，每个输入运行至少贡献一个不同的输出运行。 

结果，最后`K`下一项的运行仅取决于最后一项`K`当前学期的运行。 与被丢弃的运行的任何交互只能发生在转换后后缀的开头，而最后一个`K`输出运行已经由保留的确定`K`输入运行。 

我们现在可以选择`K = m`。 最后一个`m`小数位数最多包含`m`运行，所以最后一个`m`运行足以重建所请求的后缀。 更重要的是，这给了我们一个确定性的有限状态：该状态只是最后一个`m`运行。 

一旦一个状态重复，所有后续状态都会以相同的周期重复。 对于从以下位置开始的“看即说”序列`1`，这些后缀状态很快就会在右端陷入熟悉的周期性行为。 稳定性从右向左传播，因此对于包含的后缀`m`仅运行`O(m)`在状态进入其循环之前需要进行转换。 实际上，周期很短，但我们不需要对其周期进行硬编码。 我们可以直接用字典来检测循环。 

结果方法仅处理`O(m)`仅按生成的状态运行`O(m)`达到后缀循环之前的状态。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数为`n`| 指数为`n`| 太慢了|
 | 带有循环检测的运行后缀模拟 |`O(m²)`|`O(m²)`| 已接受 |

 ## 算法演练

 1. 阅读`n`和`m`，并设置`K = m`。 我们使用 run 是因为每个 run 至少占用一位数字，所以最后一个`m`数字永远不能包含超过`m`运行。 
2. 从第一个学期开始，`1`，表示为单次运行`(1, 1)`。 我们最初还保留当前术语索引`1`。 
3. 如果当前术语少于`K`运行时，正常转换完整的运行列表。 在这个阶段，整个术语都被表示出来，因此不存在截断问题。 
4. 一旦该术语至少`K`运行，只保留最后一个`K`运行。 通过替换来改变这些运行`(digit, count)`与两个字符`count`和`digit`，然后对结果字符序列进行游程编码。 因为每个保留的输入运行至少贡献一个输出运行，所以最后一个`K`即使原始术语的前缀被丢弃，输出运行也是准确的。 
5. 每次转换后，将生成的运行列表截断到最后一个`K`运行。 状态现在是一个最多包含`K` `(digit, count)`对。 
6. 从包含的第一个状态开始`K`运行时，将每个状态及其首次出现的术语索引存储在一起。 如果某个状态再次出现，则两个指数之间的差值就是周期长度。 
7.让`remaining`是达到期限仍需要的转换次数`n`。 如果`remaining`大于周期长度，以周期长度为模减少它。 这可能取代`10^18`最多转换一个周期的转换。 
8. 重建最后一个`m`通过从右向左读取运行来从最终运行列表中获取数字。 一次跑步`(digit, count)`贡献`count`的副本`digit`; 至少尽快停止`m`数字已被收集。 如果整个术语包含少于`m`数字，则返回完整的术语。 

### 为什么它有效

 不变的是，每当存储的状态包含`K`运行，这正是最后一个`K`实序列项的运行。 假设当前术语是这样。 每个存储的输入运行都被编码成一对，其最终数字等于该输入运行的数字。 由于连续的输入运行具有不同的数字，因此每个输入运行至少贡献一个输出运行，因此最后一个`K`输出运行不能依赖于保留后缀之前的任何输入运行。 因此，该变换恰好产生了最后一个`K`下一个实数项的运行。 每次转换后，不变量都成立。 

一旦相同的状态出现两次，决定论就会从两次出现中给出相同的后继状态。 因此，整个未来是周期性的。 跳过完整的月经周期会使状态保持不变，因此在足月时达到的状态`n`被准确地保存下来。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def normalize(runs, k):
    """
    Apply one look-and-say operation to the supplied suffix of runs.

    When k runs are supplied from the end of a real term, the last k
    output runs are determined completely by these runs.
    """
    chars = []

    for digit, count in runs:
        chars.append(str(count))
        chars.append(digit)

    out = []

    for ch in chars:
        if out and out[-1][0] == ch:
            out[-1] = (ch, out[-1][1] + 1)
        else:
            out.append((ch, 1))

    if len(out) > k:
        out = out[-k:]

    return tuple(out)

def suffix_from_runs(runs, m):
    parts = []
    need = m

    for digit, count in reversed(runs):
        take = min(count, need)
        parts.append(digit * take)
        need -= take
        if need == 0:
            break

    return ''.join(reversed(parts))

def solve():
    n, m = map(int, input().split())

    if n == 1:
        print("1")
        return

    k = m

    # The complete first term.
    state = (("1", 1),)
    index = 1

    # States are only needed once the suffix contains k runs.
    seen = {}
    history = []

    while index < n:
        if len(state) < k:
            new_state = normalize(state, k)
        else:
            if state not in seen:
                seen[state] = index
                history.append(state)

            new_state = normalize(state, k)

        index += 1
        state = new_state

        if index >= n:
            break

        if len(state) == k:
            if state in seen:
                cycle_start = seen[state]
                cycle_len = index - cycle_start

                remaining = n - index
                if remaining >= cycle_len:
                    skip = remaining // cycle_len
                    index += skip * cycle_len

                if index >= n:
                    break

            else:
                seen[state] = index
                history.append(state)

    print(suffix_from_runs(state, m))

if __name__ == "__main__":
    solve()
```状态存储为`(digit, count)`成对而不是字符串。 由于序列生成自`1`永远不会包含超过三个相等数字的游程，每个计数都是一个十进制数字，完全匹配转换规则。`normalize`首先从保留的运行中创建编码字符流。 然后，它对该短流执行普通的游程长度编码。 只有最后一个`k`保留结果运行，因为早期运行不会影响请求的后缀。 

循环字典由完整的运行状态决定，而不仅仅是最后几位数字。 这很重要，因为两个字符串可以具有相同的文本后缀，但具有不同的运行边界，并且这些边界会影响下一个转换。 

解决方案中的任何地方都没有整数转换。 答案最多可能包含`1000`数字，因此将其视为 Python 整数是不必要的，并且如果在问题的不同版本中请求的后缀以零开头，也可能会丢失前导信息。 这里最安全的表示始终是字符串。 

转换计数基于术语索引，而不是基于零的偏移量。 学期`1`是国家`1`，并且一个转换进入术语`2`。 始终保持这一约定可以避免循环跳跃中最常见的差一错误。 

## 工作示例

 对于示例 1，输入为`1 2`。 无需转换，因为请求的术语已经是第一个术语。 

| 术语索引 | 运行 | 请求的后缀 |
 | ---| ---| ---|
 | 1 |`(1,1)`|`1`|

 完整的项只有一位数字，因此算法返回`1`而不是将其填充到两位数。 这说明了短期边界条件。 

对于示例 2，输入为`42 1`。 我们只需要最后一次运行，因为`m = 1`。 

| 术语索引 | 最后一次运行 | 最后一位数字 |
 | ---| ---| ---|
 | 1 |`(1,1)`|`1`|
 | 2 |`(1,2)`|`1`|
 | 3 |`(1,1)`|`1`|
 | 4 |`(1,2)`|`1`|
 | ... | ... | ... |
 | 42 | 42`(1,1)`或者`(1,2)`|`1`|

 每个术语都以原始数字结尾`1`，因此无论在学期中发生哪个最终运行计数`42`，它的最后一位数字是`1`。 因此输出是`1`。 

当出现更有趣的行为时`m`更大。 例如，序列的最后四位数字最终会通过一个短周期模式移动：

 | 术语 | 最后四位数字 |
 | ---| ---|
 | 8 |`3211`|
 | 9 |`1221`|
 | 10 | 10`2211`|
 | 11 | 11`2221`|
 | 12 | 12`3211`|

 一旦重复相同的运行状态，算法就不需要单独模拟剩余的项。 它跳跃整个周期长度。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(m²)`| 最多`O(m)`生成相关状态，并且每个转换过程`O(m)`运行|
 | 空间|`O(m²)`| 循环字典存储`O(m)`状态，每个状态包含`O(m)`运行|

 最大`m`只是`1000`，因此大约一百万个存储的运行条目在内存限制内，而该序列的实际周期要短得多。 关键的改进是巨大的价值`n`, 直至`10^18`，除了用于跳过完整周期的算术中之外，永远不会出现在模拟循环中。 

## 测试用例```python
import sys
import io

def solve_string(inp: str) -> str:
    data = inp.strip().split()
    n = int(data[0])
    m = int(data[1])

    if n == 1:
        return "1"

    def normalize(runs, k):
        chars = []
        for digit, count in runs:
            chars.append(str(count))
            chars.append(digit)

        out = []
        for ch in chars:
            if out and out[-1][0] == ch:
                out[-1] = (ch, out[-1][1] + 1)
            else:
                out.append((ch, 1))

        return tuple(out[-k:])

    def get_suffix(runs, k):
        parts = []
        need = k

        for digit, count in reversed(runs):
            take = min(count, need)
            parts.append(digit * take)
            need -= take
            if need == 0:
                break

        return ''.join(reversed(parts))

    state = (("1", 1),)
    index = 1
    seen = {}

    while index < n:
        state = normalize(state, m)
        index += 1

        if len(state) == m:
            if state in seen:
                cycle_start = seen[state]
                cycle_len = index - cycle_start

                remaining = n - index
                if remaining >= cycle_len:
                    index += (remaining // cycle_len) * cycle_len

                if index >= n:
                    break
            else:
                seen[state] = index

    return get_suffix(state, m)

# Provided sample 1.
assert solve_string("1 2\n") == "1", "sample 1"

# Provided sample 2.
assert solve_string("42 1\n") == "1", "sample 2"

# Minimum-size input.
assert solve_string("1 1\n") == "1", "minimum input"

# The fourth term is 1211, so its final two digits are 11.
assert solve_string("4 2\n") == "11", "off-by-one around fourth term"

# The fifth term is 111221, so its final two digits are 21.
assert solve_string("5 2\n") == "21", "suffix extraction"

# Large n with the smallest suffix.
assert solve_string("1000000000000000000 1\n") == "1", "maximum n"

# m is larger than the entire third term 21.
assert solve_string("3 100\n") == "21", "m larger than term"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1`|`1`| 最小术语和最小后缀大小 |
 |`4 2`|`11`| 正确的术语索引和右侧提取 |
 |`5 2`|`21`| 运行转换和后缀处理 |
 |`1000000000000000000 1`|`1`| 最大限度`n`和周期跳跃|
 |`3 100`|`21`|`m`大于完整术语 |

 ## 边缘情况

 用于输入`1 2`，算法立即返回`1`。 当前运行列表仅包含`(1,1)`，其总长度小于`m`。 不引入零填充，这符合当术语短于请求的后缀时打印术语本身的要求。 

用于输入`4 2`，生成的项是`1`,`11`,`21`， 和`1211`。 第四学期已结束`(1,1)`,`(2,1)`,`(1,2)`。 从右读，最后的运行贡献`11`，所以请求的后缀正是`11`。 该算法永远不会混淆运行计数`2`有两个单独的输出数字，因为运行在结构上表示为`(digit='1', count=2)`。 

用于输入`3 100`，请求的后缀比整个术语长。 第三项是`21`，代表为`(2,1), (1,1)`。 后缀重建消耗了两次运行，然后停止，因为完整的项已被恢复。 输出保持不变`21`，没有人工补零。 

用于输入`1000000000000000000 1`，该算法不会尝试执行`10^18`转变。 和`m = 1`，存储的状态仅包含最右边的运行。 在短暂的瞬态之后，该状态是周期性的，并且周期计算会跳过绝大多数所需的期限索引。 最后一位数字始终是`1`，所以输出是`1`。 

主要的实施风险是按数字而不是按游程截断。 穿过运行中间的后缀将失去其完整计数并可能更改下一个术语。 存储完整的运行可以完全避免这个问题。 另一个危险是仅从文本后缀检测循环。 运行边界是状态的一部分，因为下一个转换读取组，而不是单个字符。 通过存储最后一个`m`完整的运行中，算法准确地保留了未来后缀转换所需的信息。
