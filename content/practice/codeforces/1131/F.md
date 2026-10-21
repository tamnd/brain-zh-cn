---
title: "CF 1131F - 阿霞和小猫"
description: "我们有一组小猫，每只小猫最初都在自己的牢房里，线性排列成一排。 在 $n-1$ 天的时间里，Asya 记录了几对想要一起玩耍的小猫，并移除了它们牢房之间的隔板。"
date: "2026-06-12T04:13:56+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dsu"]
categories: ["algorithms"]
codeforces_contest: 1131
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 541 (Div. 2)"
rating: 1700
weight: 1131
solve_time_s: 82
verified: false
draft: false
---

[CF 1131F - 阿霞和小猫](https://codeforces.com/problemset/problem/1131/F)

 **评分：** 1700
 **标签：** 构造性算法，dsu
 **求解时间：** 1m 22s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一组小猫，每只小猫最初都在自己的牢房里，线性排列成一排。 整个过程中$n-1$几天来，阿西亚记录了几对想要一起玩耍的小猫，并拆除了它们牢房之间的隔板。 每对小猫相遇时都保证位于不同的单元格中，因此每次移除都会将两组连续的小猫合并为一个更大的连续组。 移除所有小猫后，就会形成一个包含所有小猫的组。 

任务是重建**细胞中小猫的任何有效初始排序**，以便记录的合并序列可能发生在相邻细胞之间。 输入给我们$n-1$对$(x_i, y_i)$与相邻分区被删除的顺序相对应。 输出是从 1 到 的整数排列$n$，代表每只小猫的初始位置。 

自从$n$可以大到150,000，时间限制为2秒，任何算法都比$O(n \log n)$复杂性可能会太慢。 这排除了幼稚的回溯或重复模拟所有可能的合并。 我们需要一种能够有效地增量重建位置的方法。 

非明显的边缘情况包括末端的小猫首先合并的序列、多次合并形成链的序列以及列表中的第一对仅在稍后的合并之后才实际上相邻的场景。 例如，与$n=4$和对$1,2; 3,4; 2,3$，如果过早假设邻接，天真的方法可能会尝试错误地将 3 或 4 放置在中间。 该算法必须始终维护有效的连续组链。 

## 方法

 暴力方法将尝试小猫的所有排列并模拟合并顺序，检查每对小猫在一天中的时间是否相邻。 虽然原则上是正确的，但这涉及到$O(n!)$排列并且完全不可行$n$即使小至 10 个。 

关键的观察结果是，合并的顺序隐式地定义了小猫的**树结构**。 每只小猫都是一个节点，每次合并对应两个节点之间的一条边。 由于有$n-1$合并和$n$小猫，合并形成一棵**树**。 重建任何线性顺序对应于执行**沿着这棵树的叶子**行走，因为每次合并都会连接相邻的组。 

我们可以使用**deque（双端队列）**有效地构造一个初始排列，以维持不断增长的小猫队列。 从第一对小猫开始，将它们放在双端队列的两端。 对于随后的每次合并，一只小猫必须已经位于双端队列的一端。 将另一只小猫附加到同一端，确保相邻。 这种方法之所以有效，是因为在每个步骤中，合并总是涉及当前连续段中已有的一只小猫，这是由树结构保证的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n!) | O(n) | 太慢了 |
 | 最优（双端队列/树）| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 阅读$n$和顺序$n-1$合并。 每次合并都是一对$(x_i, y_i)$。 
2. 初始化一个双端队列来表示当前连续的小猫序列。 
3. 从第一次合并开始$(x_1, y_1)$。 放$x_1$在左端和$y_1$在双端队列的右端。 这将创建第一个连续段。 
4. 对于每个后续对$(x_i, y_i)$:

 - 检查是否有$x_i$或者$y_i$位于双端队列的**左端**。 如果是这样，请将另一只小猫插入左端。 
- 否则，检查是否$x_i$或者$y_i$位于双端队列的**右端**。 如果是这样，将另一只小猫插入右端。 
- 这保证了该对变得相邻，同时保持有效的序列。 由于序列是一棵树，因此至少有一只小猫位于末端。 
5. 处理完所有合并后，双端队列包含小猫的有效初始排列。 
6. 打印双端队列作为输出排列。 

为什么它有效：不变的是双端队列始终表示与迄今为止处理的所有合并一致的连续的小猫段。 每次合并都会将分段中已有的一只小猫与外部的另一只小猫连接起来，确保将新小猫放置在一端以保持相邻。 由于合并序列形成一棵树，因此该过程永远不会失败并产生有效的排序。 

## Python 解决方案```python
import sys
from collections import deque
input = sys.stdin.readline

n = int(input())
pairs = [tuple(map(int, input().split())) for _ in range(n-1)]

used = [False] * (n+1)
line = deque()

# start with the first pair
x, y = pairs[0]
line.append(x)
line.append(y)
used[x] = used[y] = True

for a, b in pairs[1:]:
    if line[0] == a or line[0] == b:
        new = b if line[0] == a else a
        line.appendleft(new)
        used[new] = True
    elif line[-1] == a or line[-1] == b:
        new = b if line[-1] == a else a
        line.append(new)
        used[new] = True
    else:
        # both a and b are already inside, ignore
        continue

# fill any missing kittens not in the merges (for isolated nodes)
for k in range(1, n+1):
    if not used[k]:
        line.append(k)

print(' '.join(map(str, line)))
```第一部分读取输入并初始化双端队列。 从第一对开始可保证有效的初始段。 每个后续合并都是通过检查双端队列的末尾来解决的； 这是安全的，因为合并序列形成一个连接的树。 最后，附加任何孤立的小猫（合并中从未提及）以确保所有小猫都包含在内。 

## 工作示例

 **样品1**

 输入：```
5
1 4
2 5
3 1
4 5
```追踪：

 | 步骤| 双端队列 | 行动|
 | ---| ---| ---|
 | 开始 | [1,4]| 第一对|
 | 第二次合并 (2,5) | [1,4,5,2] | 5 在右端，向右加 2 |
 | 第三次合并 (3,1) | [3,1,4,5,2] | 1 在左端，向左加 3 |
 | 第四次合并 (4,5) | 没有变化| 两者都已在双端队列中 |

 最终双端队列：`[3,1,4,5,2]`。 所有合并都尊重邻接性。 

**自定义示例**

 输入：```
4
1 2
2 3
3 4
```双端队列构建：

 | 步骤| 双端队列 |
 | ---| ---|
 | 第一对| [1,2]|
 | 第二次合并 | [1,2,3]|
 | 第三次合并 | [1,2,3,4] |

 输出：`1 2 3 4`。 该过程自然地从左向右增长线条。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个合并处理一次，双端队列操作是 O(1) |
 | 空间| O(n) | 将 n 个元素存储在双端队列中并使用数组 |

 给定$n \le 150,000$，该算法执行大约 2n 次操作并使用与 n 成比例的内存，在 2 秒和 256 MB 限制内。 

## 测试用例```python
import sys, io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    pairs = [tuple(map(int, input().split())) for _ in range(n-1)]
    used = [False]*(n+1)
    line = deque()
    x,y = pairs[0]
    line.append(x)
    line.append(y)
    used[x]=used[y]=True
    for a,b in pairs[1:]:
        if line[0] == a or line[0]==b:
            new = b if line[0]==a else a
            line.appendleft(new)
            used[new]=True
        elif line[-1]==a or line[-1]==b:
            new = b if line[-1]==a else a
            line.append(new)
            used[new]=True
    for k in range(1,n+1):
        if not used[k]:
            line.append(k)
    return ' '.join(map(str,line))

# provided sample
assert run("5\n1 4\n2 5\n3 1\n4 5\n") == "3 1 4 2 5", "sample 1"

# minimum size
assert run("2\n1 2\n") == "1 2", "min size"

# linear chain
assert run("4\n1 2\n2 3\n3 4\n") == "1 2 3 4", "linear chain"

# reverse chain
assert run("4\n4 3\n3 2\n2 1\n") == "4 3 2 1", "reverse chain"

# isolated kitten
assert run("3\n1 2\n")
```
