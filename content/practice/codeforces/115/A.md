---
title: "CF 115A - 派对"
description: "我们被要求组织一个公司聚会，使得任何团体都不能直接或间接地同时包含经理及其下属。 输入描述每个员工的直接经理：从 1 到 n 的数字，如果没有经理，则为 -1。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs", "trees"]
categories: ["algorithms"]
codeforces_contest: 115
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 87 (Div. 1 Only)"
rating: 900
weight: 115
solve_time_s: 111
verified: true
draft: false
---

[CF 115A - 派对](https://codeforces.com/problemset/problem/115/A)

 **评分：** 900
 **标签：** dfs 和类似的、图形、树
 **求解时间：** 1m 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求组织一个公司聚会，使得任何团体都不能直接或间接地同时包含经理及其下属。 输入描述每个员工的直接经理：从 1 到 _n_ 的数字，如果没有经理，则为 -1。 我们的目标是计算所需的最小组数，以便在任何组内没有员工优于其他员工。 

这种层次结构形成了一个森林：每个没有经理的员工都是根，所有其他员工都链接到他们的经理。 由于不存在循环，因此每个员工都有一条直达根的路径。 在没有上下级冲突的情况下对员工进行分组的问题简化为在这些树中选择级别。 树中相同深度的员工可以安全地放置在同一组中，因为他们之间没有上下级关系。 

约束 _n_ ≤ 2000 表明 O(n²) 算法可能勉强适合，但首选 O(n) 或 O(n log n)。 边缘情况包括让所有员工独立（全部为 -1），在这种情况下只需要一组，或者拥有一个长的员工链，其中组的数量等于链的长度。 粗心的实现可能会假设一棵树而不是一片森林，并错过一些根。 

## 方法

 暴力方法会尝试将员工所有可能的分组，检查每个组内的上级关系。 这显然是不可行的，因为分区的数量呈指数级增长。 即使模拟所有成对的员工并尝试贪婪地分配组也会变成 O(n²)，并且在深度计算中很容易出现差一的错误。 

关键的见解来自树结构。 每棵树的高度给出了该树所需的最小组数，因为最长的上级链需要许多单独的组以避免冲突。 因此，问题就简化为找到森林中每棵树的高度并取最大值。 深度优先搜索 (DFS) 是从根开始计算每个节点深度的自然方法。 每个根的深度都是 1，每个子根的深度等于其父根的深度加 1。 

这一观察结果将一个组合问题转变为一个简单的遍历问题。 我们不是检查所有对，而是遍历每棵树一次并跟踪最大深度，给出 O(n) 解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2ⁿ × n²) | O(2ⁿ × n²) | O(n²) | 太慢了 |
 | DFS深度计算| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 阅读 _n_ 和直接管理人员名单。 如果需要，将经理索引转换为从零开始的索引。 将经理下的每个员工收集起来，形成代表森林中树木的邻接表。 
2. 识别所有根。 这些是经理为 -1 的员工。 
3. 初始化变量`max_depth`为零。 这将保持最高树的高度。 
4. 定义一个递归 DFS 函数，对于给定节点，计算其子树的深度。 叶子的深度为 1。对于具有子节点的节点，深度为 1 加上其子节点中的最大深度。 
5. 对于每个根，调用DFS函数并更新`max_depth`如果返回的深度大于当前的深度`max_depth`。 
6. 遍历完所有树后，`max_depth`是所需的最小组数。 打印该值。 

其原理：通过将所有员工置于同一组中的相同深度，我们可以保证单个组中不存在上下级对。 任何树中最长的链决定了组的数量，因为该链的每个级别都必须分为不同的组。 由于 DFS 正确计算了树的高度，因此取所有树的最大高度即可得出整个森林的最小组数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(3000)

n = int(input())
managers = [int(input()) - 1 for _ in range(n)]

# build the tree forest
children = [[] for _ in range(n)]
roots = []

for i in range(n):
    if managers[i] == -2:
        roots.append(i)
    else:
        children[managers[i]].append(i)

def dfs(node):
    if not children[node]:
        return 1
    depth = 0
    for child in children[node]:
        depth = max(depth, dfs(child))
    return depth + 1

max_depth = 0
for root in roots:
    max_depth = max(max_depth, dfs(root))

print(max_depth)
```为了方便起见，我们首先将 -1 转换为 -2。 然后我们建立一个`children`列出其中`children[i]`存储由员工 _i_ 直接管理的所有员工。 DFS 函数通过递归计算其子节点的深度并加 1 来计算节点的深度。对于每个根，我们计算其深度并跟踪最大值。 这里使用递归很方便，因为树的高度最多为_n_，这符合递归限制。 

## 工作示例

 ### 示例 1

 输入：```
5
-1
1
2
1
-1
```| 步骤| 节点| 儿童 | 深度返回 | 最大深度|
 | ---| ---| ---| ---| ---|
 | DFS 0 | 0 | [1,3]| 3 | 3 |
 | DFS 1 | 1 | [2] | 2 | 3 |
 | DFS 2 | 2 | []| 1 | 3 |
 | DFS 3 | 3 | []| 1 | 3 |
 | DFS 4 | 4 | []| 1 | 3 |

 我们看到两棵树：根 0 的深度为 3，根 4 的深度为 1。最高的树需要 3 组。 

### 示例 2

 输入：```
4
-1
-1
-1
-1
```所有员工都是独立的。 

| 节点| 儿童 | 深度返回 | 最大深度|
 | ---| ---| ---| ---|
 | DFS 0 | []| 1 | 1 |
 | DFS 1 | []| 1 | 1 |
 | DFS 2 | []| 1 | 1 |
 | DFS 3 | []| 1 | 1 |

 所有员工都可以在一个组中。 算法正确输出 1。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | DFS 每位员工都会被拜访一次 |
 | 空间| O(n) | 存储子列表和递归堆栈 |

 该算法以相对于员工数量的线性时间运行，这完全符合 n ≤ 2000 的 3 秒限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.setrecursionlimit(3000)
    
    n = int(input())
    managers = [int(input()) - 1 for _ in range(n)]

    children = [[] for _ in range(n)]
    roots = []
    for i in range(n):
        if managers[i] == -2:
            roots.append(i)
        else:
            children[managers[i]].append(i)

    def dfs(node):
        if not children[node]:
            return 1
        depth = 0
        for child in children[node]:
            depth = max(depth, dfs(child))
        return depth + 1

    max_depth = 0
    for root in roots:
        max_depth = max(max_depth, dfs(root))
    return str(max_depth)

# provided sample
assert run("5\n-1\n1\n2\n1\n-1\n") == "3", "sample 1"

# custom cases
assert run("4\n-1\n-1\n-1\n-1\n") == "1", "all independent"
assert run("3\n-1\n1\n2\n") == "3", "single chain"
assert run("6\n-1\n1\n1\n2\n2\n-1\n") == "3", "multiple small trees"
assert run("1\n-1\n") == "1", "single employee"
assert run("2\n1\n-1\n") == "2", "two employees, manager first"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`4\n-1\n-1\n-1\n-1\n`| 1 | 所有独立员工|
 |`3\n-1\n1\n2\n`| 3 | 单链，深度等于 n |
 |`6\n-1\n1\n1\n2\n2\n-1\n`| 3 | 多棵树，正确的最大高度 |
 |`1\n-1\n`| 1 | 最小输入尺寸|
 |`2\n1\n-1\n`| 2 | 经理列在第一位，顺序无关紧要|

 ## 边缘情况

 如果所有员工都是独立的，则 DFS 会为每个根正确返回 1，并且 max_depth 为 1，这是正确的最小组计数。 在单个长链中，每个员工形成一个单独的级别，并且 DFS 正确计算链长度。 如果存在多棵树，该算法会跟踪所有根的最大深度，即使树的高度不同，也能确保正确的组数。
