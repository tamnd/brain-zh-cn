---
title: "CF 103797A - 顾问敌人"
description: "我们得到了一组指定人物之间的优先规则，其中每条规则都规定一个人必须按照有效的顺序出现在另一个人之前。 每个名称只是一个字符串，每个规则都从先决条件定向到从属规则。"
date: "2026-07-02T08:47:04+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103797
codeforces_index: "A"
codeforces_contest_name: "IME++ Starters Try-outs 2022"
rating: 0
weight: 103797
solve_time_s: 50
verified: true
draft: false
---

[CF 103797A - 顾问敌人](https://codeforces.com/problemset/problem/103797/A)

 **评级：** -
 **标签：** -
 **求解时间：** 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一组指定人物之间的优先规则，其中每条规则都规定一个人必须按照有效的顺序出现在另一个人之前。 每个名称只是一个字符串，每个规则都从先决条件定向到从属规则。 

任务是确定是否可以按某种顺序排列所有涉及的名称，以便同时遵守每条规则。 如果存在这样的顺序，我们输出肯定的结论，否则我们报告这是不可能的。 

从概念上讲，每个名称都是有向图中的一个节点，每个规则都是有向边。 问题是这个有向图是否承认与所有边一致的线性排序。 

约束最多允许 100,000 个关系，每个名称最多可包含 30 个字符。 这个大小立即表明对所有节点对进行任何二次推理都是不可能的。 即使构造一个显式的稠密邻接矩阵在内存和时间上也是不可行的。 需要线性或接近线性的图遍历，这强烈指向图循环检测或拓扑排序。 

一个关键的微妙问题是节点不是以整数形式给出的。 我们必须有效地将任意字符串映射到紧凑的整数 ID。 另一个边缘情况是重复或冗余约束，这不应影响正确性。 最后，通过语句不可能出现自循环，但必须检测长度大于 1 的循环。 

尝试排列节点或检查所有可能的排序的简单方法即使对于少量唯一名称也会发生组合爆炸，因为排列的数量呈阶乘增长。 

## 方法

 直接的暴力策略将尝试生成所有不同名称的排序并验证是否满足所有优先规则。 即使我们修复节点集并检查所有排列，复杂性也会成为唯一名称数量的阶乘。 即使有多达 100,000 个约束，不同名称的数量仍然足够大，以至于这种方法变得完全不可行。 

另一个天真的想法是重复删除没有传入边的节点，但如果没有仔细的图形处理，这会退化为重复扫描所有边以重新计算入度，从而在最坏的情况下导致二次行为。 

问题的结构是有向图一致性检查。 正确的见解是，当且仅当有向图是非循环时，才存在有效的排序。 使用带有递归状态跟踪的深度优先搜索或卡恩拓扑排序算法可以有效地检测有向图是否有环。 

卡恩算法在这里特别自然，因为它直接模拟重复删除没有剩余先决条件的节点。 如果在某个时刻不存在这样的节点但仍存在未处理的节点，则必须存在循环。 

我们将问题简化为构建图、计算入度以及执行类似 BFS 的消除过程。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力排列 | O(n!) | O(n) | 太慢了 |
 | 拓扑排序（卡恩）| O(M + N) | O(M + N) | 已接受 |

 ## 算法演练

 我们首先将所有字符串名称转换为整数标识符，以便图操作高效。 每个唯一名称在第一次遇到时都会分配一个索引。 

然后，我们构建一个表示所有优先约束的有向邻接列表，并计算每个节点的入度。 

然后，我们重复选择入度为零的节点，这意味着它们当前没有未满足的先决条件。 这些节点被附加到处理队列中。

我们逐个处理该队列中的节点，并且对于每个传出边，我们减少目标节点的入度。 如果入度变为零，我们将目标节点添加到队列中。 

最后，我们检查是否能够处理所有节点。 如果是，则该图是非循环的并且存在有效的排序。 如果不是，一定会出现一个阻碍进一步进展的循环。 

它之所以有效，是基于这样一个不变量：任何入度为零的节点都可以安全地放置在有效排序中的下一个节点，因为没有任何东西取决于它是否被延迟。 如果存在循环，则循环中的每个节点始终至少有一个来自循环内的传入边，因此该循环中的任何节点都不能达到入度为零。 这可以防止算法消耗所有节点。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict, deque

def solve():
    m = int(input())
    
    adj = defaultdict(list)
    indeg = defaultdict(int)
    id_map = {}
    idx = 0

    def get_id(x):
        nonlocal idx
        if x not in id_map:
            id_map[x] = idx
            idx += 1
        return id_map[x]

    for _ in range(m):
        a, b = input().split()
        u = get_id(a)
        v = get_id(b)
        adj[u].append(v)
        indeg[v] += 1
        if u not in indeg:
            indeg[u] = indeg[u]

    n = idx
    q = deque()

    for i in range(n):
        if indeg[i] == 0:
            q.append(i)

    processed = 0

    while q:
        u = q.popleft()
        processed += 1
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)

    if processed == n:
        print("I disagree with the advisor")
    else:
        print("No more comedians++")

if __name__ == "__main__":
    solve()
```该代码首先构建从字符串到整数的映射，以便图形存储变成基于数组而不是基于字符串。 这是至关重要的，因为图遍历中的直接字符串操作会引入不必要的开销。 

邻接列表存储所有有向约束，而入度字典则跟踪每个节点仍有多少个先决条件。 未作为目的地出现的节点隐式初始化为零入度。 

队列使用没有传入边的所有节点进行初始化。 然后，BFS 循环模拟在拓扑排序中重复采取有效的下一步。 每次删除一个节点时，我们都会减少其邻居的入度，从而可能解锁新节点。 

处理后的节点与总节点之间的最终比较是循环检测步骤。 如果任何节点从未被处理，则它一定是循环的一部分或被循环阻塞。 

## 工作示例

 ### 示例 1

 输入：```
JEFF POTATO
JEFF MARK
```我们将 JEFF、POTATO、MARK 映射到 ids 0、1、2。入度以 POTATO:1、MARK:1、JEFF:0 开头。 

| 步骤| 队列| 已处理 | 入度变化 |
 | ---| ---| ---| ---|
 | 初始化| [杰夫] | 0 | 马铃薯=1，马克=1 |
 | 以杰夫为例| []| 1 | 马铃薯=0，马克=0 |
 | 推新零| [马铃薯，马克] | 1 | 均已解锁 |
 | 拿土豆| [马克] | 2 | 无传出效果|
 | 采取马克 | []| 3 | 完成 |

 所有节点都已处理，因此该图是非循环的。 

输出：```
I disagree with the advisor
```此跟踪显示了删除先决条件如何逐渐解锁依赖节点，直到所有节点均可访问。 

### 示例 2

 输入：```
PETER PARKER
PARKER WAYNE
WAYNE PETER
```这在三个节点之间形成一个循环。 

| 步骤| 队列| 已处理 | 入度变化 |
 | --- | --- | --- | --- |
 | 初始化| []| 0 | 都有入度 1 |
 | 停止| []| 0 | 没有零入度节点 |

 没有节点可以启动该过程，因为每个节点都依赖于循环中的另一个节点。 

输出：```
No more comedians++
```这演示了关键的故障模式：循环阻止任何入度为零的入口点。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(M + N) | 每条边被处理一次，每个节点被排队一次 |
 | 空间| O(M + N) | 邻接表和入度存储以及映射 |

 该解决方案随关系数量线性扩展，完全符合最多 100,000 条边的约束。 

## 测试用例```python
import sys, io
from collections import defaultdict, deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    
    def solve():
        m = int(input())
        adj = defaultdict(list)
        indeg = defaultdict(int)
        id_map = {}
        idx = 0

        def get_id(x):
            nonlocal idx
            if x not in id_map:
                id_map[x] = idx
                idx += 1
            return id_map[x]

        for _ in range(m):
            a, b = input().split()
            u = get_id(a)
            v = get_id(b)
            adj[u].append(v)
            indeg[v] += 1
            if u not in indeg:
                indeg[u] = indeg[u]

        n = idx
        q = deque()
        for i in range(n):
            if indeg[i] == 0:
                q.append(i)

        processed = 0
        while q:
            u = q.popleft()
            processed += 1
            for v in adj[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)

        return "I disagree with the advisor" if processed == n else "No more comedians++"

    return solve()

# provided samples
assert run("2\nJEFF POTATO\nJEFF MARK\n") == "I disagree with the advisor"
assert run("3\nPETER PARKER\nPARKER WAYNE\nWAYNE PETER\n") == "No more comedians++"

# custom cases
assert run("1\nA B\n") == "I disagree with the advisor", "single edge"
assert run("2\nA B\nB C\n") == "I disagree with the advisor", "chain"
assert run("3\nA B\nB A\nC D\n") == "No more comedians++", "cycle + separate component"
assert run("0\n") == "I disagree with the advisor", "empty graph"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单边| 有效 | 最小 DAG |
 | 链条| 有效 | 多步订购|
 | 循环+组件| 无效| 循环检测正确性|
 | 空图| 有效 | 边界条件|

 ## 边缘情况

 一种边缘情况是约束形成多个断开连接的组件。 该算法自然地处理这个问题，因为所有组件中入度为零的所有节点最初都会排队。 每个部件独立加工，互不干扰。 

另一种情况是纯循环，没有来自外部的传入边沿。 对于输入：```
A B
B C
C A
```所有节点都以入度 1 开始，因此队列保持为空。 该算法立即返回失败，因为不可能取得进展，从而正确识别循环。 

最后一种情况是图很大但很稀疏，例如包含 100,000 个节点的长链。 每个节点仅处理一次，并且每个边仅松弛一次，因此队列的增长永远不会超过相对于结构的小恒定大小，从而确保线性性能。
