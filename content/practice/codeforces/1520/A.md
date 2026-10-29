---
title: "CF 1520A - 不要分心！"
description: "每个测试用例都给出了一系列日期，其中每一天都标有 Polycarp 当天工作的任务。 规则很简单：一旦他停止执行一项任务并切换到另一项任务，就永远不允许他返回旧任务。"
date: "2026-06-10T18:04:53+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1520
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 719 (Div. 3)"
rating: 800
weight: 1520
solve_time_s: 150
verified: true
draft: false
---

[CF 1520A - 不要分心！](https://codeforces.com/problemset/problem/1520/A)

 **评分：** 800
 **标签：** 暴力破解、实施
 **求解时间：** 2m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个测试用例都给出了一系列日期，其中每一天都标有 Polycarp 当天工作的任务。 规则很简单：一旦他停止执行一项任务并切换到另一项任务，就永远不允许他返回旧任务。 

从不同的角度来看，每个任务字母必须出现在一个连续的块中。 一项任务可以持续一天或连续多天，但该任务的所有出现必须是相邻的。 

例如，`"AABBBCC"`是有效的，因为每个字母都形成一个不间断的段。 另一方面，`"ABA"`无效，因为任务`A`出现，消失，然后再次出现。 

对于每个测试用例，我们必须确定记录的序列是否遵循此规则。 如果每个任务恰好出现在一个连续的段中，我们将打印`"YES"`。 否则我们打印`"NO"`。 

限制非常小。 最多有 1000 个测试用例，每个字符串的长度最多为 50。$O(n^2)$解决方案在所有测试中最多执行约 250 万次操作，这已经足够快了。 这意味着正确性和简单性比激进的优化更重要。 

一个微妙的边缘情况是连续重复同一任务。 考虑：```
4
AAAA
```正确答案是`"YES"`因为波利卡普从未放弃过任务`A`。 单独处理每个事件而不是每个段的粗心实现可能会错误地拒绝它。 

当任务在间隙后返回时，会出现另一个容易的错误：```
3
ABA
```正确答案是`"NO"`。 波利卡普致力于`A`，切换到`B`，然后返回到`A`。 仅检查相邻字符是否不同的实现将错过此违规行为。 

一个不太明显的情况是：```
6
AABBCC
```正确答案是`"YES"`。 一旦任务块结束，它就不会再出现。 错误地假设每个字母在字符串中只能出现一次的解决方案将拒绝像这样的有效输入。 

最后，考虑：```
7
ABCDCBA
```正确答案是`"NO"`。 其他任务开始后，几个字母会重新出现。 违规行为不仅限于完成一项任务后立即返回； 禁止在任意数量的中间任务后返回。 

## 方法

 一种简单的蛮力想法是检查每个字母并验证它的所有出现是否形成一个连续的区间。 对于每个字符，我们可以找到它的第一个和最后一个位置，然后检查它们之间的每个位置是否包含相同的字符。 由于最多有 26 个字母和最多 50 个位置，因此在限制范围内可以正常工作。 

然而，有一种更清晰的方式来思考这个问题。 唯一重要的时刻是任务切换。 连续的相同字符属于同一工作段，并且不提供新信息。 

假设我们通过仅保留每个段的第一个字符来压缩字符串。 例如：```
AABBBCCAA  ->  ABCA
```现在，压缩字符串中的每个字符代表一个不同的任务段。 规则变得非常简单：压缩字符串中任何字母都不能出现两次。 

如果一个字母在压缩后出现两次，那么该任务至少有两个单独的部分，这意味着波利卡普稍后会返回该任务。 如果每个字母最多出现一次，则每个任务恰好占用一个连续的块。 

暴力方法直接检查连续性。 优化的方法观察到只有段边界很重要，并将问题减少到检测段之间的重复字母。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(1) | O(1) | 已接受 |
 | 最佳 | O(n) | O(26) | 已接受 |

 ## 算法演练

 1. 创建一个空集，名为`seen`。 
2. 从左到右处理字符串。 
3. 对于每个位置，确定它是否开始一个新段。 如果某个位置是字符串的第一个字符或其字符与前一个字符不同，则该位置开始一个新段。 
4.每当一个新的段开始时，检查它的字母是否已经在`seen`。 
5. 如果该信件已经存在，则返回`"NO"`立即地。 这意味着该任务已出现在较早的部分中，现在正在重新审视。 
6. 否则，将该字母添加到`seen`并继续扫描。 
7. 如果处理整个字符串没有找到重复的段字母，则返回`"YES"`。 

### 为什么它有效

 套装`seen`准确包含其段已经开始的任务字母。 

每当新的段开始时，只有两种可能性。 这是该任务的第一部分，在这种情况下将其添加到`seen`有效，或者该任务已出现在较早的片段中。 在第二种情况下，波利卡普一定是先离开了那个任务，然后又回来了，这违反了规则。 

相反，如果没有重复段起始字母，则每个任务都恰好出现在一个段中。 由于每个段在构造上是连续的，因此每个任务占用一个连续的块并且调度是有效的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())

    for _ in range(t):
        n = int(input())
        s = input().strip()

        seen = set()
        ok = True

        for i in range(n):
            if i == 0 or s[i] != s[i - 1]:
                if s[i] in seen:
                    ok = False
                    break
                seen.add(s[i])

        print("YES" if ok else "NO")

solve()
```实现直接遵循算法。 

套装`seen`存储其段已经开始的字母。 条件```
i == 0 or s[i] != s[i - 1]
```检测新段的开始。 连续的相同字母将被忽略，因为它们属于同一个不间断的任务。 

操作顺序很重要。 我们首先检查该段字母之前是否出现过，然后才将其添加到集合中。 颠倒该顺序将错误地拒绝每个任务的第一次出现。 

对于长度为 1 的字符串不需要特殊处理。 第一个字符自然开始一个段，被添加到集合中，答案就变成了`"YES"`。 

由于仅出现大写字母，因此该集合包含的元素绝不会超过 26 个。 

## 工作示例

 ### 示例 1

 输入：```
ABA
```| 我| s[i] | 新的细分市场？ | 以前见过吗？ | 步骤后看到|
 | --- | --- | --- | --- | --- |
 | 0 | 一个 | 是的 | 没有 | {A}|
 | 1 | 乙| 是的 | 没有 | {A，B} |
 | 2 | 一个 | 是的 | 是的 | 违规|

 第三个角色开始一个新的任务片段`A`。 自从`A`之前已经开始了一个片段，波利卡普又回到已完成的任务。 答案是`"NO"`。 

### 示例 2

 输入：```
FFGZZZY
```| 我| s[i] | 新的细分市场？ | 以前见过吗？ | 步骤后看到|
 | --- | --- | --- | --- | --- |
 | 0 | F | 是的 | 没有 | {F}|
 | 1 | F | 没有 | - | {F}|
 | 2 | G | 是的 | 没有 | {F，G} |
 | 3 | Z| 是的 | 没有 | {F，G，Z}|
 | 4 | Z| 没有 | - | {F，G，Z}|
 | 5 | Z| 没有 | - | {F，G，Z} |
 | 6 | 是 | 是的 | 没有 | {F，G，Z，Y}|

 没有重复的段起始字母。 每个任务只占用一个块，所以答案是`"YES"`。 

此示例说明为什么必须忽略连续的相等字母。 重复的`F`和`Z`天属于同一段，并不代表返回任务。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个字符被处理一次 |
 | 空间| O(26) | 每个任务信函中该集合最多存储一个条目 |

 和$n \le 50$, even slower solutions would fit comfortably. The linear scan is trivial for the given limits and uses only a tiny amount of memory.

 ## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    def input():
        return sys.stdin.readline()

    t = int(input())
    ans = []

    for _ in range(t):
        n = int(input())
        s = input().strip()

        seen = set()
        ok = True

        for i in range(n):
            if i == 0 or s[i] != s[i - 1]:
                if s[i] in seen:
                    ok = False
                    break
                seen.add(s[i])

        ans.append("YES" if ok else "NO")

    return "\n".join(ans)

# provided sample
assert run(
"""5
3
ABA
11
DDBBCCCBBEZ
7
FFGZZZY
1
Z
2
AB
"""
) == """NO
NO
YES
YES
YES""", "sample 1"

# minimum size
assert run(
"""1
1
A
"""
) == "YES", "single task"

# all equal
assert run(
"""1
6
AAAAAA
"""
) == "YES", "single continuous segment"

# returns to a task
assert run(
"""1
5
ABCBA
"""
) == "NO", "task reappears"

# boundary between segments
assert run(
"""1
6
AABBCC
"""
) == "YES", "multiple valid segments"

# maximum-length style case
assert run(
"""1
50
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
"""
) == "YES", "long uniform string"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`A`|`YES`| 尽可能少的输入 |
 |`AAAAAA`|`YES`| 一段时间内重复的日子 |
 |`ABCBA`|`NO`| 返回先前完成的任务 |
 |`AABBCC`|`YES`| 多个有效的连续段 |
 | 50份`A`|`YES`| 一项连续任务的最大长度 |

 ## 边缘情况

 考虑：```
1
4
AAAA
```扫描从索引 0 开始一个段并添加`A`到`seen`。 其余位置不会开始新的段，因为每个字符都等于前一个字符。 没有找到重复的段字母，所以答案是`"YES"`。 这证实了长期连续工作于一项任务是有效的。 

考虑：```
1
3
ABA
```在索引 0 处，`A`开始一个段并插入到`seen`。 在索引 1 处，`B`开始一个段并被插入。 在索引 2 处，另一个段开始于`A`。 自从`A`已经在`seen`，算法立即返回`"NO"`。 这正是返回上一个任务的禁止情况。 

考虑：```
1
6
AABBCC
```段的开始是`A`,`B`， 和`C`。 每个片段在段开头只出现一次，因此集合的增长为`{A}`,`{A,B}`,`{A,B,C}`。 没有重复出现，答案是`"YES"`。 这表明只要每个任务占用一个连续的块，就允许多个任务。 

考虑：```
1
7
ABCDCBA
```段的开始是`A`,`B`,`C`,`D`,`C`,`B`,`A`。 当第二个`C`片段开始，`C`已经在`seen`，所以算法输出`"NO"`立即地。 即使涉及多个不同的任务，也会在重新出现的第一个任务时检测到违规行为。
