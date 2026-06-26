---
title: "CF 105262B - 重新索引"
description: "我们有一本书，其中每一章都有两个属性：唯一的标题和唯一的起始页码。 在一本正确的书中，章节将通过增加起始页码来排序，因为这代表了实际的阅读顺序。"
date: "2026-06-24T02:31:47+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105262
codeforces_index: "B"
codeforces_contest_name: "Game of Coders 3.0"
rating: 0
weight: 105262
solve_time_s: 49
verified: true
draft: false
---

[CF 105262B - 重新索引](https://codeforces.com/problemset/problem/105262/B)

 **评级：** -
 **标签：** -
 **求解时间：** 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一本书，其中每一章都有两个属性：唯一的标题和唯一的起始页码。 在一本正确的书中，章节将通过增加起始页码来排序，因为这代表了实际的阅读顺序。 

但是，所提供的目录已打乱。 关键是章节本身没有任何内容被损坏。 每个章节仍然指向正确的起始页，并且所有章节都只出现一次。 只是它们在列表中的顺序是错误的。 

对于每个查询，我们都会被告知艾德刚刚读完的章节的标题。 我们必须按起始页的正确顺序确定紧随其后的是哪一章。 如果完成的章节是阅读顺序的最后一章，我们输出没有下一章。 

输入大小很大：总共最多 10^5 个章节，每个测试用例最多 10^5 个查询。 这立即排除了任何针对每个查询扫描所有章节的解决方案。 在最坏的情况下，即使 O(nq) 也会达到 10^10 次操作，这远远超出了 1 秒的限制。 我们需要进行预处理，以允许在恒定时间内回答每个查询。 

当完成的章节是起始页最大的章节时，会出现微妙的边缘情况。 在这种情况下，没有有效的后继者，我们必须打印一条特殊消息。 另一个边缘情况是章节以完全任意的顺序给出，这意味着我们不能假设输入有任何部分顺序。 

## 方法

 一种直接的方法是为每个查询重建正确的阅读顺序。 对于每个查询，我们可以扫描所有章节，找到该章节的页面，然后再次扫描以找到下一个更大的页面。 这是合乎逻辑的，因为下一章只是严格大于当前页面的最小页面。 然而，每个查询的成本为 O(n)，总时间为 O(nq)，当 n 和 q 都为 10^5 时，这太慢了。 

关键的观察是结构永远不会改变。 正确的顺序完全是通过按起始页对章节进行排序来确定的。 一旦我们对它们进行一次排序，每一章都有一个固定的后继者。 这将问题转化为映射问题：对于每个章节标题，我们想知道排序列表中的下一个标题。 

我们可以预先计算一个字典，从章节标题到它在排序数组中的位置。 然后，回答查询就变成了恒定时间查找，然后是邻居检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(1) | O(1) | 太慢了 |
 | 最优（排序+哈希图）| O(n log n + n + q) | O(n log n + n + q) | O(n) | 已接受 |

 ## 算法演练

 我们独立处理每个测试用例。 

1. 将所有章节读成成对的列表（页码、标题或标题、页码）。 我们存储两者，因为排序必须按页面完成，但查询是按标题完成的。 这种分离是必要的，因为标题没有以任何有意义的方式排序。 
2. 按起始页升序对章节列表进行排序。 这重建了本书的真实阅读顺序，因为页面严格定义了顺序并且是唯一的。 
3. 构建一个字典，将每个章节标题映射到排序列表中的索引。 这允许我们直接从查询字符串跳转到其在有序序列中的位置。 
4. 对于每个查询标题，使用字典在 O(1) 中检索其索引。 
5. 如果索引不是排序列表中的最后一个位置，则输出索引+1处的标题。否则输出“No More Chapters”。 

关键思想是，一旦全局固定排序，每个查询就变成本地邻居查找而不是搜索问题。 

### 为什么它有效

按页码排序会产生唯一正确的章节总顺序，因为页码是不同的并且定义了严格的总顺序。 字典确保每个章节标题都与此顺序中的一个位置相关联。 由于排序数组中的后继关系是明确定义且稳定的，因此每个查询的答案正是该固定序列中的下一个元素。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n, q = map(int, input().split())
        chapters = []

        for _ in range(n):
            s, p = input().split()
            p = int(p)
            chapters.append((p, s))

        chapters.sort()  # sort by page

        pos = {}
        for i, (p, s) in enumerate(chapters):
            pos[s] = i

        for _ in range(q):
            c = input().strip()
            i = pos[c]
            if i == n - 1:
                out.append("No More Chapters")
            else:
                out.append(chapters[i + 1][1])

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```该解决方案首先通过对起始页上的章节进行排序来重建正确的顺序。 字典`pos`至关重要，因为它消除了查询期间的重复扫描。 每个查询都变成直接索引查找。 

一个常见的实现错误是忘记删除查询的输入字符串，这可能导致字典键不匹配。 另一个是由于元组排序混乱而意外地按标题而不是页面排序； 确保元组是`(page, title)`避免了这一点。 

## 工作示例

 ### 示例 1

 输入：```
3 3
Chapter2 43
Chapter3 60
Chapter1 1
Chapter1
Chapter2
Chapter3
```排序后的章节变为：

 | 步骤| 章节（按页排序）| 查询 | 索引 | 回答 |
 | --- | --- | --- | --- | --- |
 | 1 | (1，第 1 章)，(43，第 2 章)，(60，第 3 章) | 第一章| 0 | 第二章|
 | 2 | 相同| 第二章| 1 | 第三章|
 | 3 | 相同 | 第三章| 2 | 没有更多章节了 |

 这证实了一旦排序确定，答案就是简单的邻接检查。 

### 示例 2

 输入：```
3 1
SecondChapter 4
FirstChapter 1
ThirdChapter 24
FirstChapter
```排序顺序：

 | 步骤| 章节| 查询 | 索引 | 回答 |
 | --- | --- | --- | --- | --- |
 | 1 | (1, 第一章), (4, 第二章), (24, 第三章) | 第一章| 0 | 第二章|

 这表明输入顺序无关紧要，只有页面顺序很重要。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n + q) | O(n log n + q) | 排序占主导地位，每次查询都是 O(1) |
 | 空间| O(n) | 存储章节列表和位置图 |

 这些约束允许总章节数最多为 10^5，因此 O(n log n) 预处理步骤完全在限制范围内。 总体而言，查询处理在 q 中是线性的，这是最优的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    t = int(input())
    out = []

    for _ in range(t):
        n, q = map(int, input().split())
        chapters = []

        for _ in range(n):
            s, p = input().split()
            chapters.append((int(p), s))

        chapters.sort()
        pos = {s: i for i, (_, s) in enumerate(chapters)}

        for _ in range(q):
            c = input().strip()
            i = pos[c]
            if i == n - 1:
                out.append("No More Chapters")
            else:
                out.append(chapters[i + 1][1])

    return "\n".join(out)

# provided sample-like test
assert run("""1
3 3
Chapter2 43
Chapter3 60
Chapter1 1
Chapter1
Chapter2
Chapter3
""") == """Chapter2
Chapter3
No More Chapters"""

# boundary: single chapter
assert run("""1
1 2
Only 10
Only
Only
""") == """No More Chapters
No More Chapters"""

# already sorted
assert run("""1
3 2
A 1
B 2
C 3
A
B
""") == """B
C"""

# reverse order input
assert run("""1
3 2
C 3
B 2
A 1
A
C
""") == """B
No More Chapters"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单章| 不再有章节两次 | 最后一个元素处理 |
 | 已经排序 | 乙、丙 | 输入已排序时的正确性 |
 | 逆序| B，不再有章节 | 完全重新排序的正确性|

 ## 边缘情况

 一种极端情况是只有一章。 排序后，该章既是第一章也是最后一章。 字典仍然将其映射到索引 0，并且因为`n - 1 == 0`，每个查询都正确返回“No More Chapters”。 

另一种边缘情况是输入顺序按页反向排序时。 排序仍会恢复正确的顺序，因为页码定义了严格的总顺序。 邻接逻辑仍然有效，因为后继者始终是排序数组中的索引 + 1。 

最后的边缘情况是对同一章的重复查询。 由于我们不修改任何状态，因此每个查询都通过相同的字典查找独立解析，从而确保无论重复如何，输出都一致。
