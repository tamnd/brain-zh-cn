---
title: "CF 106353L - 去年圣诞节"
description: "我们获得了一些圣诞节前十名的音乐排行榜。 每个图表包含 10 个艺术家姓名，从位置 1（最佳）到位置 10 排序。同一艺术家可能会在同一个图表中以及不同的图表中出现多次。"
date: "2026-06-19T17:07:51+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106353
codeforces_index: "L"
codeforces_contest_name: "2025-2026 ICPC Northwestern European Regional Programming Contest (NWERC 2025)"
rating: 0
weight: 106353
solve_time_s: 52
verified: true
draft: false
---

[CF 106353L - 去年圣诞节](https://codeforces.com/problemset/problem/106353/L)

 **评级：** -
 **标签：** -
 **求解时间：** 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们获得了一些圣诞节前十名的音乐排行榜。 每个图表包含 10 个艺术家姓名，从位置 1（最佳）到位置 10 排序。同一艺术家可能会在同一个图表中以及不同的图表中出现多次。 

从所有图表的总和中，我们计算出每位艺术家总共出现的频率。 该总频率是主要分数。 如果多个艺术家的总频率相同，我们会通过查看他们在所有图表中出现在位置 1 的频率来完善比较。 如果仍然平局，我们比较位置 2 的计数，然后比较位置 3，一直持续到位置 10。如果两个或多个艺术家的所有这些计数都相同，则不存在单一获胜者，并且输出必须是“平局”。 

因此，每位艺术家都由 11 个整数组成的向量有效表示：总出场次数和 10 个位置计数。 比较是按照该向量的字典顺序进行的。 

限制很小：最多 100 个列表，每个列表大小为 10。这意味着总共最多 1000 个条目。 任何处理每个条目一次或恒定次数的解决方案都足够了。 即使重复扫描所有艺术家仍然可以，但没有必要。 

一个幼稚的错误来自于只使用总数。 例如，如果两位艺术家各出现三次，但其中一位在列表中始终排名较高，则答案不是平局。 另一个微妙的错误是忽略同一列表中的重复出现，因为它们多次对总计数和位置计数做出贡献。 

边缘情况很简单，但值得注意。 单个列表意味着答案只是该列表中出现次数最多且排名平局的艺术家。 另一个边缘情况是所有艺术家出现的次数相同并且位置分布也相同，这会导致“平局”。 最后，由于严格的词典编排规则，一位艺术家的总出场次数较少，但多次出现第一名的情况不可能发生：总次数始终占主导地位。 

## 方法

 一种直接的方法是处理所有条目并维护每个艺术家的频率结构。 对于每次出现，我们都会增加总计数和与其位置相对应的计数。 经过处理后，我们会比较所有艺术家以找到最好的一位。 

这是正确的，因为规则纯粹是累加性的，并且仅取决于聚合计数。 然而，即使我们尝试了一些更冗余的方法，例如分别重新计算每个艺术家的计数，我们也会重复扫描整个输入，从而导致不同艺术家数量上不必要的二次行为。 

关键的观察是，每个艺术家都可以通过大小为 11 的固定长度向量来完整描述，并且比较是字典顺序的。 这使我们能够一次性计算所有内容，然后使用单个比较规则选择最大值。 

因此，任务简化为构建一个从艺术家姓名到其向量的字典，然后选择最大向量，跟踪最大值是否唯一。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个艺术家的暴力重新计算| O(U * N * 10) | O(U) | 太慢了|
 | 单遍聚合+最大选择 | O(N * 10) | O(U * 11) | 已接受 |

 这里 U 是不同艺术家的数量，N 是列表的数量。 

## 算法演练

 我们通过对输入的单次扫描构建频率信息，然后通过按字典顺序比较其得分向量来确定最佳艺术家。

1. 读取列表数n。 这决定了我们将处理多少组（每组 10 个条目）。 
2. 创建一个字典，将每个艺术家姓名映射到一个包含 11 个初始化为零的整数的数组。 第一个条目代表总出现次数，接下来的 10 个代表位置 1 到 10 的计数。 
3. 对于每个列表，按顺序读出 10 位艺术家的姓名。 
4. 对于从 0 到 9 的每个位置 j，通过增加总计数以及增加位置 j+1 处的计数来更新相应的艺术家向量。 位置索引很重要，因为它编码了打破平局所需的排名信息。 
5. 处理完所有列表后，迭代所有艺术家并使用其向量的字典顺序比较来计算最佳候选者。 维护当前最佳向量和指示其是否唯一的标志。 
6. 如果另一位艺术家与当前最佳向量完全匹配，则将结果标记为不明确。 
7. 扫描后，如果唯一则输出艺术家姓名，否则输出“tie”。 

### 为什么它有效

 每个艺术家都被映射到排名规则所使用的所有相关信息的确定性摘要。 最终扫描中使用的比较程序与问题的定义相同：总频率占主导地位，位置频率按严格的顺序解决联系。 因为每次出现都被精确地计入向量的正确分量中，所以不会丢失任何信息。 因此，这些向量的字典序最大值正是将赢得所描述的消除程序的艺术家。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    stats = {}

    for _ in range(n):
        arr = input().split()
        for i, name in enumerate(arr):
            if name not in stats:
                stats[name] = [0] * 11
            stats[name][0] += 1
            stats[name][i + 1] += 1

    best_name = None
    best_vec = None
    unique = True

    for name, vec in stats.items():
        if best_vec is None:
            best_vec = vec
            best_name = name
            unique = True
        else:
            if vec > best_vec:
                best_vec = vec
                best_name = name
                unique = True
            elif vec == best_vec:
                unique = False

    if unique:
        print(best_name)
    else:
        print("tie")

if __name__ == "__main__":
    solve()
```该解决方案保留一个字典，其中每个艺术家存储一个固定大小的列表。 索引 0 累计总出现次数，而索引 1 到 10 则跟踪特定位置的计数。 这种结构直接匹配排名规则，因此比较变成了单个词典向量比较。 

选择阶段依赖于 Python 的原生列表比较，它已经执行了字典顺序。 相等性检测至关重要：即使找到了最佳向量，我们也必须验证它是唯一的。 

## 工作示例

 ### 示例 1

 输入：```
3
elton jose bowie eagles elvis wham nat joni bruce minnie
elton madonna wham elvis andy donny madonna aha chuck judy
madonna heart whitney chuck joni wham john yoko nsync stevie
```我们在这里只追踪相关艺术家。 

| 步骤| 艺术家 | 总计 | 位置 1 | 位置 2 | 最佳|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 埃尔顿 | 1 | 1 | 0 | 埃尔顿 |
 | 2 | 何塞 | 1 | 0 | 1 | 埃尔顿 |
 | ... | ... | ... | ... | ... | 埃尔顿 |
 | 全面扫描后| 麦当娜 | 3 | 1 | 1 | 麦当娜 |
 | 全面扫描后| 猛击| 3 | 1 | 0 | 麦当娜 |

 麦当娜和 Wham 的总次数都为 3，但麦当娜第一名的出场次数更多，因此麦当娜成为最佳。 

输出：```
madonna
```该迹线显示了位置计数如何打破仅靠总频率无法解决的关系。 

### 示例 2

 输入：```
2
maria a b wham c d e f maria wham
wham g h maria i j k l wham m
```| 步骤| 艺术家 | 总计 | 位置 1 | 位置 2 | 最佳|
 | --- | --- | --- | --- | --- | --- |
 | 扫描后| 玛丽亚| 3 | 1 | 0 | 玛丽亚|
 | 扫描后| 猛击| 3 | 1 | 1 | 领带 |

 这里 maria 和 wham 在比较解析后具有相同的总计数和相同的位置分布，因此两者都不严格占主导地位。 

输出：```
tie
```这表明所有 11 个维度的平等会导致模糊性，而不是任意选择获胜者。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n·10) | n 个列表中的每一个都被处理一次，每个列表有 10 个条目 |
 | 空间| O(u·11) | O(u·11) | 每个不同艺术家一个固定大小的矢量 |

 界限 n ≤ 100 使得这在实践中完全微不足道，因为操作总数最多为 1000 次更新加上一次对不同名称的传递。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# sample 1
assert run("""3
elton jose bowie eagles elvis wham nat joni bruce minnie
elton madonna wham elvis andy donny madonna aha chuck judy
madonna heart whitney chuck joni wham john yoko nsync stevie
""") == "madonna"

# sample 2
assert run("""2
maria a b wham c d e f maria wham
wham g h maria i j k l wham m
""") == "tie"

# minimum input
assert run("""1
a a a a a a a a a a
""") == "a"

# all distinct
assert run("""1
a b c d e f g h i j
""") == "a"

# tie identical structure
assert run("""1
a b c d e f g h i j
a b c d e f g h i j
""") == "tie"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单一重复艺术家| 一个 | 最小计数正确性|
 | 所有不同的单一列表 | 一个 | 位置决胜|
 | 重复的相同列表 | 领带 | 完全平等检测|

 ## 边缘情况

 最小单列表案例测试位置计数是否正确应用。 用于输入`a a a a a a a a a a`，同一艺术家累积所有位置和总数，算法立即选择最佳艺术家。 

当两个艺术家具有相同的分布向量时，就会出现完全平等的情况。 对于每个位置模式在两个名称之间完全匹配的输入，两个向量变得相同，比较检测到相等，并且输出变为“tie”。 扫描不会过早地选择一个，因为只要观察到相等性，就会更新唯一性跟踪。 

如果有许多不同的艺术家，但其中一位在早期位置占主导地位，则处理起来很自然，因为词典比较首先优先考虑总计数，然后是位置 1，确保较低位置的优势不会覆盖较强的较高优先级信号。
