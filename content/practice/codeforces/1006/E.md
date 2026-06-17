---
title: "CF 1006E - 军事问题"
description: "我们得到一个有根的军官树，其中除了根军官 1 之外，每个军官都有一个唯一的直接上级。这创建了一个层次结构，其中每个节点代表一名军官，边缘从上级指向下级。"
date: "2026-06-16T23:11:42+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs", "trees"]
categories: ["algorithms"]
codeforces_contest: 1006
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 498 (Div. 3)"
rating: 1600
weight: 1006
solve_time_s: 86
verified: true
draft: false
---

[CF 1006E - 军事问题](https://codeforces.com/problemset/problem/1006/E)

 **评分：** 1600
 **标签：** dfs 和类似的、图形、树
 **求解时间：** 1m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个有根的军官树，其中除了根军官 1 之外，每个军官都有一个唯一的直接上级。这创建了一个层次结构，其中每个节点代表一名军官，边缘从上级指向下级。 每个查询都要求我们从给定的军官开始模拟一个非常具体的遍历过程，然后报告哪位军官是该遍历期间第 k 个接收命令的军官。 

遍历规则并不是按照输入顺序编写的标准前序。 相反，每个军官将命令一一分发给其直接下属，总是选择尚未处理的最小索引下属。 在当前军官继续处理下一个下属之前，每个选定的下属都完全完成了自己的子树。 这实际上是一种深度优先搜索，其中按索引递增顺序访问子项。 

每个查询的输出是从给定的遍历根开始的此 DFS 顺序中的第 k 个节点，如果访问的节点少于 k 个，则输出为 -1。 

约束很大，最多有 200,000 个节点和 200,000 个查询。 任何为每个查询模拟 DFS 的解决方案都会太慢，因为单次遍历可能需要 O(n) 时间，并且对每个查询执行此操作会导致 O(nq)，这是完全不可行的。 即使独立存储每个节点的完整遍历数组也会占用太多内存。 

问题的结构强烈建议预处理树的全局 DFS 顺序，因为每个查询都使用相同的确定性遍历规则。 关键的挑战是我们必须快速将注意力限制在给定节点的子树上，并回答该段内的第 k 个位置查询。 

当 k 超过子树的大小时，会出现微妙的边缘情况。 例如，如果一个节点在其 DFS 范围内只有两个后代且 k = 5，则正确答案为 -1。 另一种情况是当一个节点是叶子时，这种情况下它的遍历列表就是它本身，所以只有 k = 1 有效。 

## 方法

 直接模拟将通过运行 DFS 并在访问节点时附加节点来从查询节点开始构建遍历列表。 这是正确的，因为遍历规则是确定性的，并且将 DFS 与排序的邻接表相匹配。 然而，每个查询可能需要遍历整个子树，在最坏的情况下是 O(n)。 最多 2e5 个查询，这将变为 O(nq)，这远远超出了任何可行的限制。 

关键的观察结果是，如果我们按升序修复子树，则整个树的 DFS 遍历会产生全局排序，其中每个子树对应于一个连续的段。 这是 DFS 排序的经典类似欧拉图的属性。 一旦我们计算了这个顺序一次，每个子树就成为这个数组的一个切片。 

为了支持快速查询，我们为每个节点记录DFS第一次访问它时的进入时间以及完成其子树后的退出时间。 那么节点u的整个子树对应于DFS数组中从tin[u]到tout[u]的连续段。 从 u 开始遍历的第 k 个访问节点就是该数组中的第 (tin[u] + k - 1) 个元素，前提是它不超过 tout[u]。 

因此，预处理会构建单个 DFS 订单并存储入场位置。 每个查询都变成 O(1) 算术检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个查询的强力 DFS | O(nq) | O(n) | 太慢了|
 | 预先计算的 DFS 顺序 + 索引 | O(n + q) | O(n) | 已接受 |

 ## 算法演练

 我们通过将子树遍历转变为基于预先计算的 DFS 顺序的范围索引来解决该问题。

1. 使用邻接表构建树，并通过增加索引对每个节点的子节点进行排序。 这保证了遍历顺序符合始终首先选择最小的可用下级的规则。 
2.从节点1开始运行单个DFS，维护一个全局定时器和一个数组`order`。 每次我们进入一个节点，我们记录它的进入时间并将其附加到`order`。 这捕获了遍历中访问节点的确切时刻。 
3. 访问完节点的所有子节点后，我们记录其退出时间。 间隔`[tin[u], tout[u]]`现在正好代表属于 u 子树的 DFS 顺序段。 
4. 对于每个查询`(u, k)`，计算指数`pos = tin[u] + k - 1`。 如果`pos`大于`tout[u]`，子树不包含 k 个元素，因此返回 -1。 
5.否则返回`order[pos]`，这是 u 的 DFS 遍历中第 k 个访问过的节点。 

它的工作原理来自于树上 DFS 的结构属性：一旦输入一个节点，在返回其父节点之前，将访问其子树中的所有节点，并且由于子节点是按排序顺序处理的，因此生成的全局序列完全遵循所需的扩展规则。 这使得每个子树在全局遍历中成为一个连续的区间，因此位置查询简化为简单的索引。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**7)

n, q = map(int, input().split())
p = list(map(int, input().split()))

g = [[] for _ in range(n + 1)]
for i, par in enumerate(p, start=2):
    g[par].append(i)

for i in range(1, n + 1):
    g[i].sort()

order = []
tin = [0] * (n + 1)
tout = [0] * (n + 1)
timer = 0

def dfs(u):
    global timer
    tin[u] = timer
    order.append(u)
    timer += 1

    for v in g[u]:
        dfs(v)

    tout[u] = timer - 1

dfs(1)

for _ in range(q):
    u, k = map(int, input().split())
    pos = tin[u] + k - 1
    if pos > tout[u]:
        print(-1)
    else:
        print(order[pos])
```DFS 构建了遍历的单个线性表示。 数组`order`正是从根开始进行完整遍历时军官接收命令的顺序。 数组`tin`和`tout`定义该序列对应于每个子树的段。 

对邻接列表进行排序至关重要，因为如果没有它，遍历顺序将取决于输入顺序，而不是所需的最小索引优先规则。 

每个查询都是通过将第 k 个位置转换为该全局顺序中的直接索引来回答的。 边界检查确保我们不会访问子树段之外的内容。 

## 工作示例

 ### 示例 1

 考虑一个小的层次结构：```
1 -> {2, 3}
2 -> {4}
3 -> {}
4 -> {}
```DFS顺序是`[1, 2, 4, 3]`。 

| 步骤| 行动| 订单| 锡/兜售更新|
 | --- | --- | --- | --- |
 | 1 | 访问 1 | [1] | 锡[1]=0 |
 | 2 | 转到 2 | [1,2]| 锡[2]=1 |
 | 3 | 转到 4 | [1,2,4]| 锡[4]=2 |
 | 4 | 返回，转至3 | [1,2,4,3] | 锡[3]=3 |

 立即查询`(2,2)`要求 2 的子树中的第二个节点。子树顺序为`[2,4]`，所以答案是 4。计算使用`tin[2]=1`，因此位置为 2，与 DFS 数组中的索引 2 匹配。 

### 示例 2

 链状树：```
1 -> 2 -> 3 -> 4
```DFS顺序是`[1,2,3,4]`。 

供查询`(3,1)`，我们得到`tin[3]=2`，所以位置是 2，答案是`order[2]=3`。 为了`(3,2)`，位置变为3，有效并返回4。对于`(3,3)`，位置超过`tout[3]=3`，所以输出为-1。 

这证实了子树段的行为是连续的间隔。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + q) | DFS 访问每个节点一次，每次查询都是 O(1) |
 | 空间| O(n) | 邻接表、DFS 顺序和时序数组 |

 预处理与树的大小呈线性关系，并且每个查询都通过常数算术来解决，这完全符合 n、q 最多 200,000 的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    import subprocess, textwrap
    return subprocess.run(
        ["python3", "-c", solution_code],
        input=inp.encode(),
        stdout=subprocess.PIPE
    ).stdout.decode().strip()

solution_code = r"""
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**7)

n, q = map(int, input().split())
p = list(map(int, input().split()))

g = [[] for _ in range(n + 1)]
for i, par in enumerate(p, start=2):
    g[par].append(i)

for i in range(1, n + 1):
    g[i].sort()

order = []
tin = [0] * (n + 1)
tout = [0] * (n + 1)
timer = 0

def dfs(u):
    global timer
    tin[u] = timer
    order.append(u)
    timer += 1
    for v in g[u]:
        dfs(v)
    tout[u] = timer - 1

dfs(1)

for _ in range(q):
    u, k = map(int, input().split())
    pos = tin[u] + k - 1
    if pos > tout[u]:
        print(-1)
    else:
        print(order[pos])
"""

# sample test (structure only placeholder since full sample omitted)
# assert run("...") == "..."
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 链树 k=1 | 正确的自我| 叶和边界|
 | 子树 k 溢出 | -1 | k | 超出范围
 | 平衡树| 正确的DFS | 订购正确性|

 ## 边缘情况

 叶节点查询测试算法是否正确处理单节点子树。 自从`tin[u] == tout[u]`， 仅有的`k = 1`映射在有效区间内，并且任何较大的 k 都正确地失败了范围检查。 

深链测试 DFS 顺序是否与子树切片保持一致。 即使节点是嵌套的，连续间隔属性仍然有效，确保正确的索引。 

具有许多子节点的节点确保排序是必要的。 如果不对邻接表进行排序，遍历顺序将与所需的最小索引优先规则不匹配，从而导致不正确的 DFS 序列以及涉及兄弟顺序的所有查询的错误答案。
