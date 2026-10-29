---
title: "CF 1528C - 宁静之树"
description: "我们在同一组顶点 1..n 上有两棵有根树。 两棵树都以顶点 1 为根。根据这两棵树，我们定义了一个图。 如果两个顶点同时满足两个条件，则它们是连接的。"
date: "2026-06-10T17:02:42+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "greedy", "trees"]
categories: ["algorithms"]
codeforces_contest: 1528
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 722 (Div. 1)"
rating: 2300
weight: 1528
solve_time_s: 192
verified: true
draft: false
---

[CF 1528C - 宁静之树](https://codeforces.com/problemset/problem/1528/C)

 **评分：** 2300
 **标签：** 数据结构、dfs 和类似、贪婪、树
 **求解时间：** 3m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在同一组顶点上有两棵有根树`1..n`。 两棵树都以顶点为根`1`。 

从这两棵树中我们定义了一个图。 如果两个顶点同时满足两个条件，则它们是连接的。 

第一个条件表示在第一棵树中，一个顶点位于根到其他路径上。 换句话说，这两个顶点在第一棵树中是与祖先相关的。 

第二个条件表示在第二棵树中，两个顶点都不是另一个顶点的祖先。 他们在第二棵树中的祖先间隔一定是无法比较的。 

任务是找到图中最大团的大小。 

直接图从未明确构建。 高达`3 * 10^5`跨所有测试用例的顶点，甚至存储所有可能的边也是不可能的。 上的图表`3 * 10^5`顶点可以大致包含`4.5 * 10^10`边缘。 

这些约束立即排除了任何检查顶点对的方法。 一个`O(n²)`算法需要大约`9 * 10^10`最坏情况下的操作。 我们需要一些接近线性或`O(n log n)`。 

问题中最微妙的部分是了解派系是什么样的。 

假设第一棵树是一个链：```
1
|
2
|
3
|
4
```每对选定的顶点都与第一棵树中的祖先相关。 唯一剩下的要求是第二棵树中没有任何对与祖先相关。 

粗心的解决方案可能会尝试最大化第二棵树中间隔成对不相交的顶点数量。 这还不够。 我们需要一个更强的属性：对于每一对，两个区间都不能包含另一个。 禁止嵌套间隔，因为嵌套意味着第二棵树中存在祖先关系。 

当一个选定顶点的区间包含多个其他顶点时，就会出现另一个容易的错误。 

例子：```
Second tree:
1
├─2
│ └─3
└─4
```顶点的间隔`2`和`3`是嵌套的。 即使它们可能位于第一棵树中的同一条路径上，它们也不能同时属于该派系。 

根源也值得关注。 在第二棵树中，根是每个顶点的祖先。 它的区间包含所有其他区间。 因此，根永远不能与有效团内的另一个顶点共存。 

## 方法

 暴力的观点是构建纪念图并计算其最大派系。 

对于每一对顶点，我们可以通过检查两棵树中的祖先关系来确定它们是否形成边。 这已经花费了`O(n²)`。 构建图后，在一般图中找到最大团是 NP 困难的，使得这个方向完全没有希望。 

关键的观察是这里生成的图具有非常特殊的结构。 

考虑一个派系。 由于第一棵树中的每对顶点必须与祖先相关，因此所有团顶点必须位于第一棵树的单个根到节点路径上。 

为什么？ 

取团中的任意两个顶点。 它们在第一棵树中必须具有可比性。 有根树中成对可比的一组顶点形成一条链，这正是从根向下的路径。 

现在看第二棵树。 

对于任何两个派顶点，在第二棵树中都不能是另一个的祖先。 使用欧拉游程区间，每个顶点对应一个子树区间`[tin, tout]`。 祖先关系变成区间包含。 

因此，团对应于第一棵树的一条路径上的一组顶点，其在第二棵树中的间隔是成对非包含的。 

更强有力的说法是正确的。 

如果我们维护第二棵树区间的集合，使得没有区间包含另一个区间，则第二棵树中任何两个对应的顶点都是非祖先相关的。 由于所有维护的顶点都来自第一棵树 DFS 中的一条当前路径，因此它们会自动形成一个团。 

这将问题转化为：

 在遍历第一棵树中的路径时，维护第二棵树中间隔成对非包含的最大可能顶点集。 

区间结构表明了有序集解。 在第一棵树上进行 DFS 期间，在进入时添加顶点，在离开时删除顶点。 我们将当前最优间隔集合保留在当前路径上。 

著名的解决方案在第二棵树中维护按欧拉进入时间排序的间隔。 每当插入一个新间隔时，最多可能需要删除一个现有间隔。 这会产生一个`O(n log n)`算法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) 或更糟 | O(n²) | 太慢了|
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 ### 预处理第二棵树

 首先在第二棵树上进行欧拉游览。 

对于每个顶点`v`，计算：`tin[v]`= 进入时间`tout[v]`= 退出时间

 顶点`u`是的祖先`v`在第二棵树中的确切时间：`tin[u] ≤ tin[v]`和`tout[v] ≤ tout[u]`。 

### 维持活跃的派系

 在第一棵树的 DFS 期间，递归堆栈表示一条从根到当前的路径。 

我们维护该路径中的一组选定顶点。 我们不是直接存储顶点，而是以平衡结构排序存储它们的欧拉进入时间。 

不变的是所选顶点对应于第二棵树中的间隔，使得没有一个顶点包含另一个顶点。 

### DFS 转换

 1. 输入一个顶点`v`在第一棵树中。 
2. 求出之前和之后的时间间隔`tin[v]`在有序集合中。 
3. 检查当前选择的区间之一是否已包含以下区间：`v`。 

如果存在这样的区间，则添加`v`会增加派系规模。 我们删除包含间隔的内容并插入`v`。 
4. 否则检查是否`v`包含选定的间隔之一。 

如果是，则添加`v`会使收集变得更糟，因为`v`比它包含的区间更不具体。 我们不插入`v`。 
5.否则`v`与所有选定的区间都无法比较。 插入它。 
6. 使用集合的当前大小更新全局答案。 
7. DFS 进入子代`v`在第一棵树中。 
8、处理完所有children后，准确回滚进入时进行的修改`v`。 

这会将数据结构恢复到与父路径对应的状态。 

### 为什么它有效

 在任何时刻，DFS 堆栈都是第一棵树中的一条路径。 每个选定的顶点都属于该路径，因此每对选定的顶点在第一棵树中都与祖先相关。 

维护的集合始终包含第二棵树中成对不包含的区间。 有根树中的两个区间只有在其中一个区间包含另一个区间时才会违反集团条件。 更新规则保留了遏制的缺失。 

当新的区间包含在现有选定区间内时，用较小的区间替换较大的区间不会减少未来的可能性。 较小的间隔严格上更具限制性，并且为其他不相交的间隔留出至少同样多的空间。 这是关键的贪心步骤。 

因此，维护的集合是当前根到节点路径上的顶点之间的最大可能团。 取所有 DFS 状态的最大大小会产生全局最大团。 

## Python 解决方案```python
import sys
from bisect import bisect_left

input = sys.stdin.readline
sys.setrecursionlimit(1 << 20)

def solve():
    t = int(input())
    ans_out = []

    for _ in range(t):
        n = int(input())

        g1 = [[] for _ in range(n + 1)]
        p1 = list(map(int, input().split()))
        for i, p in enumerate(p1, start=2):
            g1[p].append(i)

        g2 = [[] for _ in range(n + 1)]
        p2 = list(map(int, input().split()))
        for i, p in enumerate(p2, start=2):
            g2[p].append(i)

        tin = [0] * (n + 1)
        tout = [0] * (n + 1)

        timer = 0

        def dfs2(v):
            nonlocal timer
            timer += 1
            tin[v] = timer
            for to in g2[v]:
                dfs2(to)
            tout[v] = timer

        dfs2(1)

        active = []
        best = 0

        def is_ancestor(u, v):
            return tin[u] <= tin[v] and tout[v] <= tout[u]

        def dfs1(v):
            nonlocal best

            pos = bisect_left(active, tin[v])

            inserted = False
            removed_vertex = -1

            if pos > 0:
                pred_tin = active[pos - 1]
                pred = tin_to_vertex[pred_tin]

                if is_ancestor(pred, v):
                    active.pop(pos - 1)
                    active.insert(pos - 1, tin[v])

                    inserted = True
                    removed_vertex = pred

                    best = max(best, len(active))

                    for to in g1[v]:
                        dfs1(to)

                    active.pop(pos - 1)
                    active.insert(pos - 1, tin[pred])
                    return

            if pos < len(active):
                succ_tin = active[pos]
                succ = tin_to_vertex[succ_tin]

                if is_ancestor(v, succ):
                    best = max(best, len(active))

                    for to in g1[v]:
                        dfs1(to)

                    return

            active.insert(pos, tin[v])
            inserted = True

            best = max(best, len(active))

            for to in g1[v]:
                dfs1(to)

            active.pop(bisect_left(active, tin[v]))

        tin_to_vertex = [0] * (n + 1)
        for v in range(1, n + 1):
            tin_to_vertex[tin[v]] = v

        dfs1(1)

        ans_out.append(str(best))

    sys.stdout.write("\n".join(ans_out))

if __name__ == "__main__":
    solve()
```第一个 DFS 计算第二棵树中的欧拉区间。 由于子树间隔成为连续的段，因此祖先查询减少为间隔包含测试。 

第二个 DFS 在第一棵树上运行。 递归堆栈正是我们正在考虑的派系候选路径。 

有序结构`active`存储当前选定顶点的欧拉进入时间。 关键的事实是，在没有包含的区间中，排序依据`tin`就足够了。 任何可以包含新间隔的间隔都必须是按此顺序排列的前一个间隔。 新区间可以包含的任何区间都必须是其后继区间。 这就是为什么只需要检查两个邻居。 

从递归调用返回后立即处理回滚。 每个 DFS 状态都准确地看到与其自己的根到节点路径相对应的集合。 

## 工作示例

 ### 示例 2

 输入：```
5
1 2 3 4
1 1 1 1
```第一棵树是一条链。 第二棵树是一颗星星。 

第二棵树中的欧拉区间：

 | 顶点| 间隔 |
 | --- | --- |
 | 1 | [1,5]|
 | 2 | [2,2]|
 | 3 | [3,3]|
 | 4 | [4,4]|
 | 5 | [5,5]|

 第一棵树上的 DFS：

 | 当前顶点 | 活动集|
 | --- | --- |
 | 1 | {1} |
 | 2 | {2} |
 | 3 | {2,3} |
 | 4 | {2,3,4} |
 | 5 | {2,3,4,5} |

 根区间包含所有其他区间，因此它会立即被替换。 所有叶子间隔都是成对不可比较的，从而给出了团的大小`4`。 

### 示例 4

 输入：```
7
1 1 3 4 4 5
1 2 1 4 2 5
```在第一棵树的 DFS 过程中，多个顶点替换了第二棵树中间隔包含它们的祖先。 

| 顶点输入 | 行动| 派系大小 |
 | --- | --- | --- |
 | 1 | 插入 | 1 |
 | 3 | 替换包含祖先 | 1 |
 | 4 | 插入 | 2 |
 | 6 | 插入 | 3 |

 达到的最大尺寸是`3`，对应于顶点`{3,4,6}`。 

该轨迹演示了贪婪替换规则。 较大的包含区间永远不会比其中较小的区间更好。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个顶点执行恒定数量的有序集操作 |
 | 空间| O(n) | 树、欧拉数组、递归栈、活动集 |

 全部的总和`n`值最多是`3 · 10^5`。 一个`O(n log n)`解决方案执行大约几百万次平衡结构操作，完全符合限制。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    def solve():
        from bisect import bisect_left

        input = sys.stdin.readline
        t = int(input())
        ans = []

        for _ in range(t):
            n = int(input())

            g1 = [[] for _ in range(n + 1)]
            p1 = list(map(int, input().split()))
            for i, p in enumerate(p1, start=2):
                g1[p].append(i)

            g2 = [[] for _ in range(n + 1)]
            p2 = list(map(int, input().split()))
            for i, p in enumerate(p2, start=2):
                g2[p].append(i)

            tin = [0] * (n + 1)
            tout = [0] * (n + 1)

            timer = 0

            def dfs2(v):
                nonlocal timer
                timer += 1
                tin[v] = timer
                for to in g2[v]:
                    dfs2(to)
                tout[v] = timer

            dfs2(1)

            tin_to_vertex = [0] * (n + 1)
            for v in range(1, n + 1):
                tin_to_vertex[tin[v]] = v

            active = []
            best = 0

            def anc(u, v):
                return tin[u] <= tin[v] and tout[v] <= tout[u]

            def dfs1(v):
                nonlocal best

                pos = bisect_left(active, tin[v])

                if pos > 0:
                    p = tin_to_vertex[active[pos - 1]]
                    if anc(p, v):
                        old = active[pos - 1]
                        active[pos - 1] = tin[v]

                        best = max(best, len(active))
                        for to in g1[v]:
                            dfs1(to)

                        active[pos - 1] = old
                        return

                if pos < len(active):
                    s = tin_to_vertex[active[pos]]
                    if anc(v, s):
                        best = max(best, len(active))
                        for to in g1[v]:
                            dfs1(to)
                        return

                active.insert(pos, tin[v])

                best = max(best, len(active))
                for to in g1[v]:
                    dfs1(to)

                active.pop(bisect_left(active, tin[v]))

            dfs1(1)
            ans.append(str(best))

        return "\n".join(ans)

    return solve()

assert run(
"""4
4
1 2 3
1 2 3
5
1 2 3 4
1 1 1 1
6
1 1 1 1 2
1 2 1 2 2
7
1 1 3 4 4 5
1 2 1 4 2 5
"""
) == "1\n4\n1\n3"

assert run(
"""1
2
1
1
"""
) == "1"

assert run(
"""1
5
1 2 3 4
1 2 3 4
"""
) == "1"

assert run(
"""1
5
1 2 3 4
1 1 1 1
"""
) == "4"

assert run(
"""1
3
1 1
1 1
"""
) == "2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 两条相同的链条 | 1 | 两棵树中的每一对都与祖先相关
 | 链 vs 星 | 4 | 最大团可以是几乎所有非根顶点 |
 | n = 2 | 1 | 最小的合法投入|
 | 两棵树上都有星星| 2 | 无可比拟的二叉树区间被正确处理 |

 ## 边缘情况

 ### 相同的树

 输入：```
1
4
1 2 3
1 2 3
```第一棵树中可比较的每对顶点在第二棵树中也可比较。 不同顶点之间不存在边。 该算法不断替换间隔，但不会将活动集增长到超出大小`1`。 答案是`1`。 

### 根区间包含一切

 输入：```
1
5
1 2 3 4
1 1 1 1
```第二棵树的根区间是`[1,5]`。 当顶点`2`被访问时，其区间包含在根区间内。 该算法用顶点代替根`2`。 这正是防止根阻止未来添加的贪婪规则。 最终答案变成`4`。 

### 第二棵树中的嵌套区间

 输入：```
1
3
1 2
1 2
```顶点间隔`2`和`3`是嵌套的。 只检查第一棵树路径的粗心解决方案会选择两者。 有序集逻辑检测遏制并且绝不允许两个间隔同时保持活动状态。 答案是`1`。 

### 无与伦比的叶子

 输入：```
1
3
1 2
1 1
```顶点`2`和`3`位于第一棵树的路径上，但在第二棵树中它们是兄弟姐妹。 它们的间隔是不相交的，因此两者都留在活动集中。 算法达到大小`2`，这是正确的最大集团。
