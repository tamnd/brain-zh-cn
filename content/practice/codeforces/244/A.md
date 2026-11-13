---
title: "CF 244A - 分割橙色"
description: "我们被要求将一个由 nk 个片段组成的橙子分给 k 个孩子，以便每个孩子恰好收到 n 个片段，每个孩子肯定收到他们选择的片段，并且不会将片段分配给多个孩子。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 244
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 150 (Div. 2)"
rating: 900
weight: 244
solve_time_s: 193
verified: false
draft: false
---

[CF 244A - 划分橙色](https://codeforces.com/problemset/problem/244/A)

 **评分：** 900
 **标签：** 实施
 **求解时间：** 3m 13s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求将一个橙子分成`n*k`之间的段`k`孩子们，以便每个孩子都能准确地收到`n`段，每个孩子肯定会收到他们选择的段，并且不会将段分配给多个孩子。 输入提供每个子项的段总数`n`, 儿童数量`k`，以及一个列表`k`不同的段编号，每个编号对应于孩子想要的段。 

输出是一个列表`n*k`整数分为`k`连续的组`n`数字，代表分配给每个孩子的段。 每个孩子所在小组的顺序并不重要。 

限制因素`1 ≤ n, k ≤ 30`表示段总数最多为`900`，因此任何对段或子项进行多次迭代的算法都是可行的。 下限还意味着我们不需要对时间进行大量优化，因为即使是一个简单的贪婪方法，一个接一个地挑选未使用的段，也可以轻松运行。 

当孩子们选择位于总片段最末端的片段时，就会出现边缘情况，例如`1`或者`n*k`。 如果通过顺序填充子段来实现解决方案而不检查哪些段是空闲的，则很容易意外地将同一段分配给多个子段或错过填充子段的配额。 

## 方法

 强力方法是生成段的所有排列，然后测试每个分配以查看它是否满足约束。 这是正确的但不切实际，因为排列的数量`n*k`段按阶乘增长。 即使是为了`n=k=10`， 有`100!`排列，这是不可行的。 

关键的观察是我们不需要考虑所有排列。 每个孩子已经“保留”了一个片段。 我们可以把剩下的填满`n-1`未分配段集中每个子段的段。 由于问题保证存在答案并且可以按任意顺序分配段，因此可以采用简单的贪婪方法：按升序迭代所有段，并将每个未分配的段分配给当前子段，直到满足其配额。 这可以避免冲突，因为我们维护分配的段的记录。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((n*k)!) | O(n*k) | 太慢了 |
 | 贪心分配 | O(n*k) | O(n*k) | 已接受 |

 ## 算法演练

 1. 读取输入值`n`,`k`，以及所选段的列表`a`。 
2.初始化一组`used`跟踪已分配的段。 
3.初始化列表列表`children_segments`，每个部分都有孩子特别要求的部分。 将此段添加到`used`放。 
4. 在所有可能的段号上创建一个迭代器`1`到`n*k`。 
5. 对于每个孩子，填写剩余的`n-1`通过迭代所有段编号并选择不在其中的段来划分段`used`。 指定段后，将其添加到`used`。 
6. 毕竟孩子们已经`n`分段，压平`children_segments`以所需格式列出并打印数字。 

为什么有效：每个孩子都从他们选择的部分开始。 贪心分配确保没有段重复，因为我们总是检查`used`。 由于段的总数正好是`n*k`每个孩子都会收到准确的`n`段，所有段都只使用一次，满足所有约束。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())
a = list(map(int, input().split()))

used = set(a)
children_segments = [[x] for x in a]

all_segments = iter(range(1, n*k + 1))

for i in range(k):
    while len(children_segments[i]) < n:
        seg = next(all_segments)
        if seg not in used:
            children_segments[i].append(seg)
            used.add(seg)

# Output the segments child by child
for child in children_segments:
    print(" ".join(map(str, child)))
```该代码首先读取输入并使用其所需的段初始化每个子级。 一组可确保我们不会两次分配相同的段。 迭代所有段可保证每个孩子最终收到准确的`n`段。 拼合和打印按子顺序完成，以匹配所需的输出格式。 

## 工作示例

 **样品1**

 输入：```
2 2
4 1
```| 步骤| 儿童 1 段 | 儿童 2 段 | 下一个可用细分 |
 | ---| ---| ---| ---|
 | 初始| [4] | [1] | 1,2,3,4 |
 | 填充子 1 | [4,2]| [1] | 使用 = {1,2,4} |
 | 填充儿童 2 | [4,2]| [1,3]| 使用 = {1,2,3,4} |

 输出：```
4 2
1 3
```这证实了每个孩子恰好收到 2 个片段，包括他们选择的片段，没有重复。 

**样品2**

 输入：```
3 3
3 1 9
```| 步骤| 儿童 1 | 儿童 2 | 儿童 3 | 下一个可用 |
 | ---| ---| ---| ---| ---|
 | 初始| [3] | [1] | [9]| 1..9 | 1..9
 | 填充子 1 | [3,2,4]| [1] | [9]| 使用={1,2,3,4,9} |
 | 填充儿童 2 | [3,2,4]| [1,5,6]| [9]| 使用={1,2,3,4,5,6,9} |
 | 填充儿童 3 | [3,2,4]| [1,5,6]| [9,7,8]| 使用={1..9} |

 输出：```
3 2 4
1 5 6
9 7 8
```跟踪确认贪婪分配满足更多子项和段的所有约束。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n*k) | 每个分段最多被考虑一次； 每个孩子都被精确地填充到`n`段。 |
 | 空间| O(n*k) | 存储已分配的段和已使用的段集。 |

 给定`n*k ≤ 900`，该算法最多执行 900 次迭代，在 2 秒内完成，并且内存占用很小，不到 1 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    used = set(a)
    children_segments = [[x] for x in a]
    all_segments = iter(range(1, n*k + 1))
    for i in range(k):
        while len(children_segments[i]) < n:
            seg = next(all_segments)
            if seg not in used:
                children_segments[i].append(seg)
                used.add(seg)
    return "\n".join(" ".join(map(str, child)) for child in children_segments)

# provided sample
assert run("2 2\n4 1\n") == "4 2\n1 3" or run("2 2\n4 1\n") == "2 4\n1 3"

# custom: minimum input
assert run("1 1\n1\n") == "1"

# custom: maximum n and k
inp = "30 30\n" + " ".join(map(str, range(1,31))) + "\n"
out = run(inp)
assert all(len(line.split()) == 30 for line in out.split("\n"))

# custom: chosen segments at edges
assert run("3 2\n1 6\n") in ["1 2 3\n6 4 5","1 3 2\n6 4 5","1 2 3\n6 5 4"]

# custom: consecutive chosen segments
assert run("2 3\n2 3 4\n") in ["2 1\n3 5\n4 6"]
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1\n1 | 1 1 1 | 最小尺寸|
 | 30 30 + 1..30 | 30 30 + 1..30 每行有 30 个数字 | 最大尺寸，所有儿童均已满 |
 | 3 2\n1 6 | 1 2 3\n6 4 5 | 1 2 3\n6 4 5 边界处选定的段|
 | 2 3\n2 3 4 | 2 3\n2 3 4 | 2 1\n3 5\n4 6 | 连续选择的段|

 ## 边缘情况

 对于单个孩子和一个分段`1 1\n1`，该算法使用所选段初始化子级，并跳过 while 循环，产生`[1]`正确。 

对于最大尺寸输入`n=k=30`孩子们选择了前 30 个段，算法按顺序填充每个孩子的剩余 29 个段，从未分配的数字 31 到 900。没有段被重用的不变量保持不变，因为每个新分配的段都会根据`used`放。 这证实了算法在不违反问题约束的情况下扩展到上限。
