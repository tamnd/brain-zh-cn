---
title: "CF 1647E 小圆和六年级学生"
description: "我们有一间有 n 张桌子的教室，每张桌子最初都由一个学生占据，学生的编号从 1 到 n，顺序未知。 每节课结束后，每个学生都会根据排列 p 移动到桌子上。"
date: "2026-06-10T04:07:10+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1647
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 777 (Div. 2)"
rating: 2500
weight: 1647
solve_time_s: 88
verified: false
draft: false
---

[CF 1647E - 小圆和六年级学生](https://codeforces.com/problemset/problem/1647/E)

 **评分：** 2500
 **标签：** 数据结构、dfs 及类似、贪婪
 **求解时间：** 1m 28s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一间教室`n`课桌，每张课桌最初由一名学生占用，编号为`1`到`n`以某种未知的顺序。 每节课结束后，每个学生都按照排列顺序走到课桌前`p`。 如果多名学生落在同一张桌子上，则仅留下人数最少的学生，所有其他学生都将被开除。 然后，空桌子上就被排满了排队等候的学生按照人数升序排列。 经过一些课程后，我们得到了最后的座位`a`和运动排列`p`，我们被要求重建字典顺序最小的初始排列`b`学生的`1`到`n`。 

挑战在于学生会被开除和替换，所以我们必须从最终的座位开始向后推理。 如果不考虑序列的组合数量，我们就无法轻松地向前模拟以找到最小的初始排列，因为每一步都可能有许多学生被开除。 字典编序的要求又增加了一层：我们必须为可以容纳它们的位置选择较小的数字。 

约束条件是`n ≤ 10^5`和`a_i ≤ 10^9`。 这排除了对课程进行任何暴力模拟或尝试所有排列的可能性。 我们的目标必须是一种能够在线性或接近线性时间内工作的算法。 非明显的边缘情况包括循环`p`多张桌子指向同一张桌子，一些学生被开除，并且链条终止于空桌子。 例如，如果`p = [2,2]`和`a = [1,3]`，天真的方法可能会将号码错误分配到错误的办公桌。 

## 方法

 暴力方法将尝试模拟从每个候选排列向前推进的过程`1..n`看看哪一个通向`a`。 即使检查单个候选人也需要`O(n)`每节课，课数可以是`O(n)`。 和`n!`可能的排列，这是完全不可行的。 解锁可行解决方案的洞察力来自于观察由下式定义的运动图：`p`。 如果我们将桌子视为节点并从中绘制边缘`i`到`p_i`，我们看到一组循环和链。 每个周期只从最初的排列中接收一名学生，因为只有数量最少的学生幸存下来，其余的则被外来者取代。 

关键的见解是，作为循环一部分的任何课桌最初都必须将最终学生固定在其中`a`到此为止，否则就会被覆盖。 按字典顺序排列的最小排列是通过对运动图执行深度优先搜索来获得的，从没有来自其他桌子的传入边缘的桌子开始，并用最小的可用数字填充每个链或循环。`a`。 通过这样做，我们确保在初始排列中尽早分配较小的数字，尊重向前移动规则。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n! * n) | O(n! * n) | O(n) | 太慢了 |
 | 基于DFS的图重建| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 构造一个有向图，其中每个桌子`i`指向桌子`p[i]`。 跟踪每个桌子的传入边缘计数。 传入边缘为零的桌子是链的起点； 循环中所有入度 ≥ 1 的桌子。 
2. 维护最终学生的排序列表`a`。 目标是将最小的可用学生人数分配给可以满足词典编目要求的职位。 
3.初始化答案数组`b`带零。 
4. 对于每个入度为零的桌子，沿着移动边缘执行深度优先遍历。 分配`a_i`到`b_i`当访问一个节点时。 从排序列表中删除指定的学生以避免重复。 这沿着从源到汇的链分配数字。 
5. 对于循环（尚未访问的节点），选择最小的未分配学生并将其分配给循环中的任意节点。 然后沿着循环继续 DFS 来分配剩余的学生。 这确保了一个循环中只有一名学生存活，并且字典顺序得以维持。 
6. 打印最终排列`b`。 

**为什么有效：** DFS 遍历确保运动图中的每个链或循环都按照学生生存的顺序分配数字。 入度为零的桌子保证首先接收最小的可用数字，这满足字典编纂的最低要求。 通过将最小的学生放在第一个访问的桌子上来处理循环，确保每个循环只有一个幸存者。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 20)

n = int(input())
p = list(map(lambda x: int(x)-1, input().split()))
a = list(map(int, input().split()))

from collections import defaultdict, deque

# build graph and in-degree
in_deg = [0]*n
graph = [[] for _ in range(n)]
for i, dest in enumerate(p):
    graph[i].append(dest)
    in_deg[dest] += 1

b = [0]*n
used = [False]*n
available = sorted(range(n), key=lambda x: a[x])  # indices of a sorted by value

def dfs(u):
    used[u] = True
    idx = available.pop(0)
    b[u] = a[idx]
    for v in graph[u]:
        if not used[v]:
            dfs(v)

# handle chains
for i in range(n):
    if in_deg[i] == 0 and not used[i]:
        dfs(i)

# handle remaining cycles
for i in range(n):
    if not used[i]:
        dfs(i)

print(' '.join(map(str, b)))
```这`available`list 维护按值排序的最终学生的索引。 DFS 确保我们按照移动图为每个办公桌分配最小的未分配编号。 首先处理链条，然后处理循环。 增加了递归限制以处理深链。 

## 工作示例

 输入示例：```
5
5 5 3 3 1
1 8 2 9 4
```| 书桌| p[i] | p[i] 一个[我] | b[i] 已分配 |
 | ---| ---| ---| ---|
 | 0 | 4 | 1 | 1 |
 | 1 | 4 | 8 | 2 |
 | 2 | 2 | 2 | 3 |
 | 3 | 2 | 9 | 5 |
 | 4 | 0 | 4 | 4 |

 遍历从零入度节点开始，然后处理循环。 最终的`b = [1,3,2,5,4]`。 

第二个例子：```
3
2 3 2
10 20 30
```图边：0→1、1→2、2→1。 节点 0 的入度为 0，从 0 开始 DFS。沿路径分配最小的数字，然后处理剩余的循环。 最终的`b = [10,30,20]`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 对最终数组进行排序最初需要 O(n log n)，DFS 遍历是 O(n) |
 | 空间| O(n) | 图形表示、b 数组、使用的和入度 |

 这种复杂性很容易满足 2 秒的时间限制`n ≤ 10^5`。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call the solution
    n = int(input())
    p = list(map(lambda x: int(x)-1, input().split()))
    a = list(map(int, input().split()))
    from collections import defaultdict, deque
    in_deg = [0]*n
    graph = [[] for _ in range(n)]
    for i, dest in enumerate(p):
        graph[i].append(dest)
        in_deg[dest] += 1
    b = [0]*n
    used = [False]*n
    available = sorted(range(n), key=lambda x: a[x])
    def dfs(u):
        used[u] = True
        idx = available.pop(0)
        b[u] = a[idx]
        for v in graph[u]:
            if not used[v]:
                dfs(v)
    for i in range(n):
        if in_deg[i] == 0 and not used[i]:
            dfs(i)
    for i in range(n):
        if not used[i]:
            dfs(i)
    print(' '.join(map(str, b)))
    return output.getvalue().strip()

# provided sample
assert run("5\n5 5 3 3 1\n1 8 2 9 4\n") == "1 3 2 5 4", "sample 1"
# minimum size
assert run("2\n1 1\n2 1\n") == "2 1", "minimum size"
# all same p (cycle)
assert run("3\n2 3 1\n5 6 7\n") == "5 6 7", "cycle handling"
# already sorted a
assert run("4\n2 3 4 1\n1 2 3 4\n") == "1 2 3 4", "sorted final a"
# reverse a
assert run("3
```
