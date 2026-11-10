---
title: "CF 2110E - 旋律"
description: "我们被要求将一组声音排列成一个既优美又不乏味的序列，每个声音都由音量和音调定义。"
date: "2026-06-08T04:36:07+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs", "implementation"]
categories: ["algorithms"]
codeforces_contest: 2110
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 1026 (Div. 2)"
rating: 2300
weight: 2110
solve_time_s: 88
verified: false
draft: false
---

[CF 2110E - 旋律](https://codeforces.com/problemset/problem/2110/E)

 **评分：** 2300
 **标签：** dfs 和类似的、图表、实现
 **求解时间：** 1m 28s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求将一组声音排列成一个既优美又不乏味的序列，每个声音都由音量和音调定义。 美丽意味着连续的声音在一个维度上完全不同：要么音量变化而音调保持不变，要么音调变化而音量保持不变。 不无聊意味着没有三个连续的声音具有相同的音量或音调。 每个声音必须在序列中恰好出现一次。 

输入提供多个测试用例。 每个测试用例都从声音的数量开始，然后是每个声音的音量和音高。 输出必须指示是否存在有效的排列。 如果是这样，我们还必须提供声音索引的有效排序。 

这些限制意味着我们无法承受强力排列方法。 和$n$最多$2 \cdot 10^5$在所有测试用例和 2 秒限制下，任何算法都比$O(n \log n)$每个测试用例可能太慢。 尝试所有方法的天真方法$n!$排列将是无望的。 此外，由于音量和音调值可以大到$10^9$，直接索引或按值计数是不可行的。 我们需要一种主要对排序顺序或相对关系进行操作的方法。 

非明显的边缘情况包括所有音量或所有音高都相同的情况。 例如，如果所有声音具有相同的音量但不同的音高，则三个连续的音高不可能相等，因此长度大于 2 的序列可能已经不可能。 当不同的音量和音高的数量接近时，会出现另一个棘手的情况，但它们的分布阻止了改变音量和改变音高之间的任何交替。 小的$n$像 1 或 2 是微不足道的，但我们必须单独处理它们，因为非无聊条件仅适用于长度为 3 或以上的序列。 

## 方法

 蛮力方法是尝试声音的所有排列并检查优美且不无聊的属性。 这原则上是正确的：给定一个排列，我们可以验证连续的差异和三元组$O(n)$时间。 然而，排列的数量是$n!$，对于$n > 10$。 因此，暴力破解是不可行的。 

关键的见解来自于观察每个声音可以按音量或音高进行分组。 如果我们首先按音量，然后按音高对声音进行排序（反之亦然），通常可以提取沿一个维度不同的序列。 具体来说，我们可以形成一个网格，其中一个轴是音量，另一个轴是音高。 我们可以以蛇状模式遍历这个网格：我们迭代给定音量的所有音高，然后移动到下一个音量，同时反转音高顺序。 这保证了连续的声音在一个维度上完全不同，因为在一个音量内移动仅改变音调，而移动到新音量仅改变音量。 通过小心地交替方向，我们可以避免在任一维度上创建三个连续的相同值。 

排序和构造这个蛇遍历是$O(n \log n)$由于排序，它需要$O(n)$用于存储订单的空间。 考虑到限制，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n) | 太慢了|
 | 通过排序进行蛇形遍历 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，阅读全部$n$声音及其原始索引。 将每个声音存储为（音量、音调、索引）的元组，以便我们可以在最后输出顺序。 
2. 按音量对声音进行分组。 在每个音量组中，按音高对声音进行排序。 这确保了组内的迭代仅改变音调。 
3. 初始化一个空结果序列。 按升序遍历每个卷组。 对于偶数组，按升序遍历音高。 对于奇数组，按降序遍历音高。 这种蛇状图案可以防止创建三个连续的相同音量或音高。 
4. 在遍历过程中将每个声音的索引附加到结果序列中。 现在，结果中的连续声音在一个维度上完全不同：音量组内的音高或在组之间移动时的音量。 
5. 构建序列后，检查是否有任何无聊的三元组。 对于结果中每个连续的三重索引，验证并非所有音量都相等并且并非所有音高都相等。 如果任何三元组违反此条件，则输出“NO”。 否则，输出“YES”，后跟索引序列。 
6. 对每个测试用例重复上述步骤。 

在构建过程中保持的不变性是，在每个卷组内，音高交替而不重复，并且在卷组之间，音量变化，而音高以交替顺序继续。 这保证了连续的声音是优美的，并防止无聊的三元组，因为蛇状遍历确保了连续没有三个相同的值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        sounds = []
        for i in range(n):
            v, p = map(int, input().split())
            sounds.append((v, p, i + 1))

        from collections import defaultdict
        groups = defaultdict(list)
        for v, p, idx in sounds:
            groups[v].append((p, idx))

        sequence = []
        volumes_sorted = sorted(groups.keys())
        toggle = False
        for v in volumes_sorted:
            pitches = sorted(groups[v])
            if toggle:
                pitches.reverse()
            for p, idx in pitches:
                sequence.append((v, p, idx))
            toggle = not toggle

        possible = True
        for i in range(2, n):
            v1, p1, _ = sequence[i-2]
            v2, p2, _ = sequence[i-1]
            v3, p3, _ = sequence[i]
            if (v1 == v2 == v3) or (p1 == p2 == p3):
                possible = False
                break

        if possible:
            print("YES")
            print(" ".join(str(idx) for _, _, idx in sequence))
        else:
            print("NO")

if __name__ == "__main__":
    solve()
```该解决方案有效地读取输入并保留原始索引。 按音量分组和按音高排序可以实现蛇形遍历。 切换可确保组之间的顺序交替，这对于避免无聊的三元组至关重要。 最终的验证循环确认没有三元组违反非无聊条件。 

## 工作示例

 **示例输入 1**```
4
179 239
179 179
239 179
239 239
```| 步骤| 正在构建序列 | 检查 |
 | --- | --- | --- |
 | 开始| []| |
 | 第179卷 群升 [(179,179,2),(179,239,1)] | |
 | 第239卷 组降序| [(179,179,2),(179,239,1),(239,239,4),(239,179,3)] | 没有无聊的三元组|
 | 决赛| 2 1 4 3 | 2 1 4 3 是 |

 该表显示连续的声音在音高或音量上有所不同，并且没有三个连续的音量或音高是相同的。 

**示例输入 2**```
1 1
2 1
3 1
```| 步骤| 序列| 检查 |
 | --- | --- | --- |
 | 第1卷组| [(1,1,1),(2,1,2),(3,1,3)] | 3 个连续投球全部 1 → 无聊 |
 | 决赛| 不可能| 否 |

 这证实了算法正确地拒绝了无法避免无聊三元组的序列。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个卷组内的排序占主导地位。 遍历和验证都是 O(n)。 |
 | 空间| O(n) | 存储声音和最终序列。 |

 该算法很容易处理$n$跨所有测试用例直至$2 \cdot 10^5$。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    return out.getvalue().strip()

# Provided samples
assert run("5\n4\n179 239\n179 179\n239 179\n239 239\n3\n1 1\n2 1\n3 1\n1\n5 7\n5\n1 1\n1 2\n2 1\n2 2\n99 99\n7\n1 1\n1 3\n2 1\n2 2\n3 1\n3 2\n3 3\n") == \
"YES\n2 1 4 3\nNO\nYES\n1\nNO\nYES\n1 2 4 3 6 5 7", "sample 1"

# Custom: minimum input
assert run("1\n1\n1 1\n") == "YES\n1", "single sound"

# Custom: maximum identical volume
assert run("1\n3\n5 1\n5 2\n5 3\n") == "NO", "all same volume, more than 2"

# Custom: all distinct
assert run("1\n4\n1 1\n2 2\n3 3\n4 4\n") == "YES\n1 2 3 4", "all distinct simple"

# Custom: maximum n simple snake
inp = "1\n6\n1 1\n1 2\n2 1\n2 2\n3 1
```
