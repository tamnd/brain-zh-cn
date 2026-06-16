---
title: "CF 100G - 为专辑命名"
description: "Aryo 想要从候选名称列表中选择新专辑的标题。 有些名称在前几年已经被使用过。 他的决策规则有两层。 如果候选人的名字以前从未被使用过，那么这是最好的选择。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "data-structures", "implementation"]
categories: ["algorithms"]
codeforces_contest: 100
codeforces_index: "G"
codeforces_contest_name: "Unknown Language Round 3"
rating: 1800
weight: 100
solve_time_s: 110
verified: true
draft: false
---

[CF 100G - 为专辑命名](https://codeforces.com/problemset/problem/100/G)

 **评分：** 1800
 **标签：** *特殊、数据结构、实现
 **求解时间：** 1m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 Aryo 想要从候选名称列表中选择新专辑的标题。 有些名称在前几年已经被使用过。 他的决策规则有两层。 

如果候选人的名字以前从未被使用过，那么这是最好的选择。 在所有未使用的候选者中，他选择了字母顺序最大的一个。 

如果每个候选者都曾被使用过，他会选择最近一次使用发生时间最长的候选者。 如果几个名字具有相同的最古老的年份，他会再次选择字母顺序最大的一个。 

输入给出了专辑名称的历史记录以及出版年份，然后是可能的新名称的列表。 我们必须打印所选的标题。 

这些约束立即表明该解应该接近线性。 最多可以有$10^5$使用姓名，因此重复扫描每个候选人的整个历史记录将变得昂贵。 二次解可以达到$10^9$操作，这远远超出了 2 秒的限制。 哈希映射是这里的自然工具，因为我们只需要快速查找与每个名称相关的最近一年。 

一个微妙的地方是，一个名字可能在历史中出现多次。 我们对最早的年份不感兴趣，我们对最近的使用情况感兴趣。 考虑这个输入：```
3
echo 1999
echo 2005
nova 2001
2
echo
nova
```正确答案是`nova`， 因为`nova`最后一次使用是在 2001 年`echo`最后一次使用是在 2005 年。存储第一次出现而不是最新出现的粗心实现会错误地选择`echo`。 

另一个容易犯的错误是按字母顺序错误地处理关系。 假设我们有：```
2
alpha 2000
beta 2000
2
alpha
beta
```这两个名字很久以前都被使用过，所以答案一定是`beta`因为它是按字母顺序排列的。 如果我们只跟踪最小年份并停止更新联系，我们将返回错误的结果。 

未使用的名称也需要小心处理。 无论年份如何，它们总是比使用过的名称更受青睐。 例如：```
1
dream 2010
2
dream
vision
```正确答案是`vision`， 虽然`dream`有一个有效的旧年份。 将未使用的名称视为具有年份`0`从概念上讲，这是可行的，但前提是实现明确将它们优先于使用的名称。 

## 方法

 直接的暴力解决方案将通过扫描整个历史记录来处理每个候选名称，以确定它是否曾经出现过以及最近的年份是什么。 对于每个候选人，我们都会与所有以前使用过的名字进行比较，并保留该候选人的最长年份。 

这在逻辑上是有效的，因为它准确地计算了决策规则所需的信息。 问题是成本。 和$10^5$历史条目和$10^4$候选人，最坏的情况变成$10^9$比较。 Python 无法在限定时间内处理如此大量的工作。 

问题的结构给出了更快的方向。 每个查询都会问同样的事情：“与该名称相关的最新年份是哪一年？” 重复地重新计算是浪费的。 相反，我们将历史记录一次预处理为从名称到最近年份的哈希映射。 

在阅读历史的同时，我们更新：```
latest[name] = max(latest[name], year)
```预处理后，可以在恒定的预期时间内评估每个候选者。 

决策规则本身也可以简化。 未使用过的名字总是比使用过的名字好。 在未使用的名称中，选择按字母顺序排列最大的名称。 如果不存在未使用的名称，请选择最近年份最小的已使用名称，打破按字母顺序排列的最大名称。 

这将整个问题变成了通过简单比较对候选者进行单次传递。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n \cdot m)$|$O(1)$| 太慢了 |
 | 最佳 |$O(n + m)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 创建一个字典，名为`latest`。 

该字典将存储每个专辑名称最近使用的年份。 
2.一一读出历史专辑名称。 

对于每个`(name, year)`配对，更新：```
latest[name] = max(existing_year, year)
```我们保留最大年份，因为问题关心的是最近的使用情况，而不是第一次使用情况。 
3. 初始化两个跟踪变量。 

一个变量存储迄今为止找到的最佳未使用候选者。 

另一个存储最常用的候选者及其最新使用年份。 
4. 处理每个候选人姓名。 

如果该名称不存在于`latest`，未使用。 将其与当前最佳未使用的候选者进行比较，并保留按字母顺序排列较大的候选者。 
5. 如果该候选项以前被使用过，则从字典中检索其最新年份。 

将其与当前最常用的候选进行比较。 

如果满足以下条件，候选人会更好：

 - 最近的年份较小，这意味着它使用的时间更长
 - 或者年份相等且名称按字母顺序排列较大
 6. 处理完所有候选后，检查是否存在未使用的候选。 

如果是，则打印最佳未使用的候选者，因为未使用的名称始终具有优先权。 

否则打印最常用的候选者。 

### 为什么它有效

 字典不变量是经过预处理后，`latest[name]`等于历史上该名称出现的最近年份。 每次更新都会保留这一点，因为我们始终保留迄今为止看到的最大年份。 

在候选处理期间，未使用的跟踪器始终存储迄今为止遇到的按字母顺序排列的最大未使用名称。 使用的跟踪器总是根据顺序存储最佳候选：

 1. 最近年份越小越好。 
2. 如果年份相同，则字母顺序越大越好。 

由于每个候选答案都是在这些规则下与当前最优值进行比较，因此最终存储的答案是全局最优的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    latest = {}

    for _ in range(n):
        name, year = input().split()
        year = int(year)

        if name not in latest or year > latest[name]:
            latest[name] = year

    m = int(input())

    best_unused = None

    best_used_name = None
    best_used_year = float('inf')

    for _ in range(m):
        name = input().strip()

        if name not in latest:
            if best_unused is None or name > best_unused:
                best_unused = name
        else:
            year = latest[name]

            if (year < best_used_year or
               (year == best_used_year and name > best_used_name)):
                best_used_year = year
                best_used_name = name

    if best_unused is not None:
        print(best_unused)
    else:
        print(best_used_name)

if __name__ == "__main__":
    solve()
```第一部分构建`latest`字典。 重要的细节是使用重复名称的最大年份。 忘记这一点会完全改变问题的含义，因为我们关心的是最近的使用情况。 

第二部分扫描候选列表一次。 该代码将未使用和已使用的候选者分开，因为未使用的名称始终主导已使用的名称。 这避免了尴尬的人为值，例如分配未使用的名称年份`-1`。 

打破平局的逻辑写得很明确：```
year < best_used_year
```表示该名称较早以前使用过，这样更好。```
year == best_used_year and name > best_used_name
```实施按字母顺序决胜局。 使用`>`之所以有效，是因为 Python 按字典顺序比较字符串。 

初始化与`float('inf')`保证第一个使用的候选者将始终替换初始占位符。 

## 工作示例

 ### 示例 1

 输入：```
3
eyesonme 2008
anewdayhascome 2002
oneheart 2003
2
oneheart
bienbien
```处理历史：

 | 名称 | 年份| 更新后最新|
 | --- | --- | --- |
 | 眼睛我 | 2008 | {eyesonme：2008} |
 | 新的一天来临了 | 2002 | {eyesonme: 2008, anewdayhacome: 2002} |
 | 一颗心 | 2003 | {eyesonme: 2008, anewdayhacome: 2002, oneheart: 2003} |

 处理候选人：

 | 候选人 | 之前使用过 | 行动| 当前最佳 |
 | --- | --- | --- | --- |
 | 一颗心 | 是的 | 最好用= oneheart | 使用： oneheart |
 | 边边| 没有 | 最好未使用= bienbien | 未使用: bienbien |

 算法打印`bienbien`因为任何未使用的名称的排名都高于所有已使用的名称。 

### 自定义示例

 输入：```
4
alpha 2005
beta 2000
gamma 2000
alpha 2010
3
alpha
beta
gamma
```处理历史：

 | 名称 | 年份| 更新后最新|
 | --- | --- | --- |
 | 阿尔法 | 2005 | {阿尔法：2005} |
 | 测试版 | 2000 | 2000 {阿尔法：2005 年，测试版：2000} |
 | 伽玛| 2000 | 2000 {阿尔法：2005，贝塔：2000，伽玛：2000}|
 | 阿尔法| 2010 | {阿尔法：2010，贝塔：2000，伽马：2000} |

 处理候选人：

 | 候选人 | 最近一年 | 比较结果| 当前最佳使用 |
 | --- | --- | --- | --- |
 | 阿尔法 | 2010 | 第一位候选人 | 阿尔法|
 | 测试版 | 2000 | 2000 早于 2010 年 | 测试版 |
 | 伽玛| 2000 | 2000 同年，按字母顺序排列| 伽玛|

 算法输出`gamma`。 

该跟踪显示了两个关键细节：重复的名称必须保留最新的年份，并且相同的年份需要按字母顺序进行比较。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n + m)$| 每个历史记录条目和每个候选者都会被处理一次 |
 | 空间|$O(n)$| 字典中每个不同的使用名称最多存储一个条目 |

 最大的输入大小正好适合这些范围。 大约$10^5$字典操作对于 Python 来说是微不足道的，并且由于名称很短，内存使用量远低于 64 MB 的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())

    latest = {}

    for _ in range(n):
        name, year = input().split()
        year = int(year)

        if name not in latest or year > latest[name]:
            latest[name] = year

    m = int(input())

    best_unused = None

    best_used_name = None
    best_used_year = float('inf')

    for _ in range(m):
        name = input().strip()

        if name not in latest:
            if best_unused is None or name > best_unused:
                best_unused = name
        else:
            year = latest[name]

            if (year < best_used_year or
               (year == best_used_year and name > best_used_name)):
                best_used_year = year
                best_used_name = name

    if best_unused is not None:
        print(best_unused)
    else:
        print(best_used_name)

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
assert run(
"""3
eyesonme 2008
anewdayhascome 2002
oneheart 2003
2
oneheart
bienbien
"""
) == "bienbien", "sample 1"

# minimum input
assert run(
"""0
1
solo
"""
) == "solo", "single unused name"

# repeated historical names
assert run(
"""3
echo 1999
echo 2005
nova 2001
2
echo
nova
"""
) == "nova", "must keep latest year"

# tie on year, alphabetical rule
assert run(
"""2
alpha 2000
beta 2000
2
alpha
beta
"""
) == "beta", "alphabetical tie break"

# multiple unused names
assert run(
"""1
dream 2010
3
vision
future
galaxy
"""
) == "vision", "largest alphabetical unused name"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 没有历史名字|`solo`| 每个候选人都未使用时的正确处理 |
 | 重复的历史名称|`nova`| 最近的年份必须覆盖较早的年份 |
 | 等年|`beta`| 已用名称按字母顺序打破平局 |
 | 多个未使用的名称 |`vision`| 按字母顺序排列最大的未使用候选人获胜 |

 ## 边缘情况

 考虑历史中重复的专辑名称：```
3
echo 1999
echo 2005
nova 2001
2
echo
nova
```字典的演变如下：```
echo -> 1999
echo -> 2005
nova -> 2001
```当审查候选人时，`echo`有最近一年`2005`尽管`nova`有`2001`。 自从`2001`年龄越大，答案就变成`nova`。 该算法可以正确处理此问题，因为它始终存储每个名称的最大年份。 

现在考虑同等年份：```
2
alpha 2000
beta 2000
2
alpha
beta
```两个候选者都有相同的最新使用年份。 算法达到平局决胜条件：```
year == best_used_year and name > best_used_name
```自从`"beta" > "alpha"`按字典顺序，答案变成`beta`。 

最后，考虑已用名称和未用名称之间的交互：```
1
dream 2010
2
dream
vision
```

`dream`成为当前最常用的候选者。 然后`vision`被识别为未使用，因此单独存储在`best_unused`。 最后，算法总是打印未使用的候选（如果存在），因此输出为`vision`。
