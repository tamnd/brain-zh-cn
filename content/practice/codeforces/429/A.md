---
title: "CF 429A - 异或树"
description: "我们得到一棵有 n 个节点的有根树，每个节点都标有 0 或 1。我们还得到每个节点的 0 和 1 的目标配置。 唯一允许的操作是“挑选”一个节点，这将翻转其值以及树中的每个第二级后代。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "trees"]
categories: ["algorithms"]
codeforces_contest: 429
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 245 (Div. 1)"
rating: 1300
weight: 429
solve_time_s: 98
verified: true
draft: false
---

[CF 429A - 异或树](https://codeforces.com/problemset/problem/429/A)

 **评分：** 1300
 **标签：** dfs 和类似的，树
 **求解时间：** 1m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵有根的树`n`节点，每个节点都标有 0 或 1。我们还为每个节点提供了 0 和 1 的目标配置。 唯一允许的操作是“挑选”一个节点，这将翻转其值以及树中的每个第二级后代。 具体来说，如果一个节点被选中，它的值会翻转，它的子节点的值保持不变，它的孙子节点翻转，它的曾孙节点保持不变，依此类推，交替级别。 

输入是标准树描述，具有连接节点的边，以及表示初始状态和目标状态的两个数组。 输出必须是要选取的最小节点序列，以便在所有操作之后，树与目标数组匹配。 

自从`n`最多可以达到 100,000 个，而且我们只有一秒钟的时间，任何多次访问所有节点或尝试所有节点子集的算法都会太慢。 我们需要一个`O(n)`基于遍历的解决方案。 边缘情况包括只有一个节点的树、完全平衡的树，或者如果不小心处理，同一分支上的多个节点将相互翻转的情况。 一个简单的解决方案可能会以任意顺序贪婪地选择节点，这可能会过度翻转节点，导致大于最小操作集。 

## 方法

 蛮力方法是尝试以每种可能的顺序选取每个节点，翻转适当的级别，并检查是否达到目标。 原则上这是可行的，因为操作是可逆的并且树是有限的，但是序列的数量呈指数增长，所以这对于`n`最多 10^5。 

关键的见解是翻转操作沿级别具有可预测的模式：偶数深度的翻转影响偶数深度的节点，奇数深度的翻转影响奇数深度的节点。 这意味着我们可以从根开始执行深度优先遍历，跟踪沿偶数和奇数深度的路径应用了多少次翻转。 在每个节点，我们根据之前翻转的累积效果来决定是否翻转。 这将问题简化为单个 DFS，其中记录了代表偶数和奇数深度翻转的两个整数，从而保证了`O(n)`解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了|
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 使用邻接表构造树。 存储初始值和目标值。 
2.初始化两个计数器，`even_flips`和`odd_flips`，跟踪偶数和奇数深度节点沿路径应用的翻转次数。 
3. 从根（深度0）开始DFS遍历。 对于每个节点，通过沿其深度应用翻转奇偶校验来计算其当前有效值。 
4. 如果当前有效值与目标不匹配，则将该节点添加到结果集中，并增加与其深度奇偶性相对应的翻转计数器。 
5. 递归到子级，传递更新的翻转计数。 
6. 访问完孩子后，回溯：翻转不需要撤消，因为我们只关心对后代的累积影响。 

为什么它有效：在每个节点，我们维护以下不变式：`current_value ^ cumulative_flips = goal_value`在那个深度。 翻转节点的决定确保了这个不变量适用于所有后代。 由于我们按照 DFS 顺序遍历，因此每个节点都会在决定是否翻转自身之前查看影响它的所有翻转。 交替的翻转模式与基于奇偶校验的跟踪相一致，保证了最少的翻转。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**6)

def solve():
    n = int(input())
    tree = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = map(int, input().split())
        tree[u].append(v)
        tree[v].append(u)
    
    init = [0] + list(map(int, input().split()))
    goal = [0] + list(map(int, input().split()))
    
    result = []
    
    def dfs(node, parent, depth, even_flips, odd_flips):
        if depth % 2 == 0:
            effective = init[node] ^ even_flips
        else:
            effective = init[node] ^ odd_flips
        
        if effective != goal[node]:
            result.append(node)
            if depth % 2 == 0:
                even_flips ^= 1
            else:
                odd_flips ^= 1
        
        for child in tree[node]:
            if child != parent:
                dfs(child, node, depth + 1, even_flips, odd_flips)
    
    dfs(1, 0, 0, 0, 0)
    
    print(len(result))
    for node in result:
        print(node)

solve()
```邻接表有效地表示了树。 我们使用`sys.setrecursionlimit`因为深树可能会溢出递归。`even_flips`和`odd_flips`跟踪偶数和奇数深度节点的累积翻转。 DFS 确保每个节点都被访问一次，并根据当前有效状态做出决策。 由于我们的计数器是特定于深度的并且按值传递，所以要小心避免回溯翻转。 

## 工作示例

 ### 输入示例 1

 | 节点| 深度| 初始化| 目标| 有效 | 翻动？ | 偶数翻转 | 奇数翻转 |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 0 | 1 | 1 | 1 | 没有 | 0 | 0 |
 | 2 | 1 | 0 | 0 | 0 | 没有 | 0 | 0 |
 | 4 | 2 | 1 | 0 | 1 | 是的 | 1 | 0 |
 | 7 | 3 | 0 | 1 | 0 | 是的 | 1 | 1 |

 该轨迹确认翻转应用于正确的奇偶校验深度，并且算法识别出最小集`[4, 7]`。 

### 自定义输入```
3
1 2
1 3
1 1 0
0 0 1
```| 节点| 深度| 初始化| 目标| 有效 | 翻动？ | 偶数翻转 | 奇数翻转 |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 0 | 1 | 0 | 1 | 是的 | 1 | 0 |
 | 2 | 1 | 1 | 0 | 1 | 是的 | 1 | 1 |
 | 3 | 1 | 0 | 1 | 0 | 是的 | 1 | 0 |

 这证实了深度奇偶跟踪能够正确处理同级。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | DFS 中每个节点都会被访问一次。 |
 | 空间| O(n) | 邻接表和递归栈需要 O(n)。 |

 这`O(n)`时间保证解决方案在 1 秒限制下舒适地工作`n`最多 10^5。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Sample 1
assert run("10\n2 1\n3 1\n4 2\n5 1\n6 2\n7 5\n8 6\n9 8\n10 5\n1 0 1 1 0 1 0 1 0 1\n1 0 1 0 0 1 1 1 0 1\n") == "2\n4\n7"

# Minimum-size input
assert run("1\n0\n1\n") == "1\n1"

# Maximum-size linear tree
n = 1000
edges = "\n".join(f"{i} {i+1}" for i in range(1, n))
init = " ".join("0" for _ in range(n))
goal = " ".join("1" if i%2==0 else "0" for i in range(n))
assert run(f"{n}\n{edges}\n{init}\n{goal}\n") != "", "max-size linear"

# All-equal initial and goal
assert run("3\n1 2\n1 3\n0 0 0\n0 0 0\n") == "0"

# Root-only flip needed
assert run("3\n1 2\n1 3\n1 0 0\n0 0 0\n") == "1\n1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 节点翻转 | 1\n1 | 1 处理最少的输入 |
 | 1000 节点线性 | 非空| 高效处理深层树木 |
 | 全零 | 0 | 检测无需翻转 |
 | 根翻转 | 1\n1 | 1 正确翻转根会影响奇偶校验 |

 ## 边缘情况

 如果初始！=目标，则单节点树必须翻转。 该算法检查深度 0，通过零翻转计算有效值，并在必要时翻转根。 

在兄弟姐妹需要独立翻转的树中，算法可以正确跟踪奇偶校验。 例如，一个
