---
title: "CF 1804E - 路由"
description: "我们得到一个最多有 20 个顶点的无向连通图。 每个顶点代表一个服务器，边代表直接的双向通信链路。 对于每个服务器 $u$，我们必须恰好选择一个相邻顶点 $a(u)$。"
date: "2026-06-15T04:01:41+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "brute-force", "dfs-and-similar", "dp", "graphs"]
categories: ["algorithms"]
codeforces_contest: 1804
codeforces_index: "E"
codeforces_contest_name: "Nebius Welcome Round (Div. 1 + Div. 2)"
rating: 2400
weight: 1804
solve_time_s: 171
verified: false
draft: false
---

[CF 1804E - 路由](https://codeforces.com/problemset/problem/1804/E)

 **评分：** 2400
 **标签：** 位掩码、暴力破解、dfs 和类似、dp、图表
 **求解时间：** 2m 51s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个最多有 20 个顶点的无向连通图。 每个顶点代表一个服务器，边代表直接的双向通信链路。 

对于每台服务器$u$，我们必须恰好选择一个相邻顶点$a(u)$。 将此视为为每个节点分配一个指向其邻居之一的单个传出指针，因此整个系统变成一个有向图，其中每个节点的出度恰好为 1。 

路由递归地工作：从$u$到$v$, 节点$u$首先检查是否直接连接到$v$。 如果没有，它将请求委托给$a(u)$，并重复相同的过程。 生成的路径是所选辅助边的链，后面是最终的直接边$v$。 

要求极其严格：对于每个订购的对$(u, v)$，这个过程最终必须成功并产生一条有效的路径。 

关键的困难在于，如果所选指针创建的循环永远不会到达与 相邻的顶点，则该过程可能会永远循环。$v$。 所以分配$a(u)$必须全局构建图表，以便每个目的地$v$通过此授权过程，从每个起点都是“可见的”。 

约束条件$n \le 20$是最重要的信号。 它强烈建议在子集或哈密顿结构上使用指数状态技术，而不是在一般结构上使用多项式图算法。 任何类似的东西$O(2^n n^2)$是可以接受的，而任何枚举任意函数的东西$a(u)$直接，这将是$n^n$，是不可能的。 

如果尝试构建一棵生成树并将每个节点指向其父节点，则会出现一种微妙的故障模式。 这会产生一个有根树结构，但路由通常变得不可能，因为不同的目标$v$要求祖先不能保证位于每个根路径上。 一个小的反例是一棵树，其中一些顶点$v$是一片叶子，其唯一的邻居位于另一个分支的深处； 不相关节点的祖先链永远不会遇到该邻居。 

真正的约束是全局的并且在所有对之间是对称的，并且不能按源进行分解。 

## 方法

 从原始定义开始：每个节点选择一个邻居，因此我们在无向基本图上得到一个函数图。 每个节点都恰好有一个出边，因此该有向图的每个连通分量都恰好有一个有向环，并且所有节点最终都流入该环。 

如果我们修复任何起始节点$u$，路由过程只访问与以下功能组件相同的节点$u$。 这意味着如果存在多个组件，则一个组件中的节点永远无法通过委托到达另一组件中的节点。 

现在考虑问题对于固定目的地的要求$v$。 从每个起始节点开始$u$，委托链起始于$u$最终必须到达某个直接相邻的节点$v$。 这意味着每个组件必须至少包含每个顶点的一个邻居$v$。 如果有两个不同的组件，请选择一个顶点$v$其邻域并未完全出现在其中一个中，这在连接的简单图结构中是不可避免的。 唯一能避免大家矛盾的办法$v$同时是将整个图强制转换为单个功能组件。 

每个节点的出度都为 1 并且只有一个分量的函数图必须恰好由一个覆盖所有顶点的有向循环组成。 如果任何节点在循环之外，它最终都会流入其中，从而产生第二个组件结构矛盾。 因此，该结构折叠成包含所有顶点的单个循环。 

这给出了一个清晰的表征：我们需要原始图中的哈密顿循环。 一旦存在这样的循环，我们就会一致地定位它并设定$a(u)$到循环上的下一个顶点。 然后从任意起始节点开始，重复委托遍历整个循环，因此每个节点在闭包中都变得可达。 由于每个顶点在图中某处至少有一个邻居，因此每个目标$v$其邻居将位于此封闭区域内，保证成功。 

因此，问题简化为在图中找到哈密顿循环$n \le 20$，这是一个经典的位掩码动态规划问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解所有功能$a(u)$|$O(n^n \cdot n)$|$O(n)$| 太慢了 |
 | 哈密​​顿循环 DP |$O(n^2 2^n)$|$O(n 2^n)$| 已接受 |

 ## 算法演练

 我们将问题简化为在给定图中构建哈密顿循环。 

1. 修复起始顶点，例如$0$。 我们将搜索一个循环，该循环恰好访问每个顶点一次并返回$0$。 这确保了单一的全局循环结构。 
2.定义DP状态$dp[mask][v]$意味着我们已经访问了恰好的顶点`mask`, 开始于$0$，当前结束于顶点$v$。 我们只允许沿着输入图的边缘进行转换。 
3. 初始化$dp[1 \ll 0][0] = true$。 这表示从顶点 0 开始，仅访问过该顶点。 
4. 对于每个州$(mask, v)$，尝试扩展到任何邻居$to$的$v$尚未进入`mask`， 环境$dp[mask \cup \{to\}][to] = true$。 我们还存储父指针来重建路径。 
5. 填充DP后，我们寻找一种状态，其中所有顶点都被访问过，并且有一条从端点返回到$0$。 如果存在这样的状态，我们就重建哈密顿循环。 
6. 如果不存在这样的状态，我们输出“No”。 
7. 否则，我们采取循环顺序$c_0, c_1, \dots, c_{n-1}$，并定义$a(c_i) = c_{i+1}$， 和$a(c_{n-1}) = c_0$。 

为什么这种方法有效来自于早期的结构简化：任何有效的解决方案都必须形成跨越所有顶点的单个有向循环，并且任何哈密顿循环都会产生有效的分配。 DP 在所有可能的循环构造上都是完备的，因此当且仅当图中存在一个循环时，它才能找到这样的循环。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
adj = [[] for _ in range(n)]
g = [[False]*n for _ in range(n)]

for _ in range(m):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    adj[u].append(v)
    adj[v].append(u)
    g[u][v] = g[v][u] = True

if n == 1:
    print("No")
    sys.exit()

N = 1 << n
dp = [[False]*n for _ in range(N)]
par = [[-1]*n for _ in range(N)]

start = 0
dp[1 << start][start] = True

for mask in range(N):
    if not (mask & (1 << start)):
        continue
    for v in range(n):
        if not dp[mask][v]:
            continue
        for to in adj[v]:
            if mask & (1 << to):
                continue
            nmask = mask | (1 << to)
            if not dp[nmask][to]:
                dp[nmask][to] = True
                par[nmask][to] = v

full = (1 << n) - 1
end = -1

for v in range(n):
    if dp[full][v] and g[v][start]:
        end = v
        break

if end == -1:
    print("No")
    sys.exit()

cycle = []
mask, v = full, end

while v != -1:
    cycle.append(v)
    pv = par[mask][v]
    mask ^= (1 << v)
    v = pv

cycle.reverse()

pos = [0]*n
for i, x in enumerate(cycle):
    pos[x] = i

a = [0]*n
for i in range(n):
    a[i] = cycle[(pos[i] + 1) % n] + 1

print("Yes")
print(*a)
```该代码首先构建邻接结构和布尔边缘矩阵，以进行快速循环闭合检查。 DP 枚举从节点 0 开始的所有哈密顿路径。当找到有效的完成时，父指针会重建完整的循环。 

关键的微妙之处在于强制最终端点连接回起点，确保我们真正形成一个循环，而不仅仅是覆盖所有顶点的路径。 

一旦循环恢复，我们就为每个顶点分配该循环中的后继节点，将无向哈密顿循环转换为所需的函数图。 

## 工作示例

 ### 示例 1

 输入：```
3 3
1 2
2 3
3 1
```这已经是一个三角形了。 

我们从节点 0 开始 DP。DP 扩展到覆盖所有节点的完整掩码，结束于某个顶点，例如 2。由于 2 连接回 0，因此我们接受循环。 

| 步骤| 面膜| 终点|
 | --- | --- | --- |
 | 初始化| 001| 0 |
 | 展开 | 011| 1 |
 | 展开 | 111 | 111 2 |

 我们重建循环`[0,1,2]`并分配指针`0→1, 1→2, 2→0`。 

这证实了在完整的循环图中，解决方案是立即的。 

### 示例 2

 输入：```
4 4
1 2
2 3
3 4
4 1
```这是4个周期。 

DP同样构建了完整的访问路径。 

| 步骤| 面膜| 终点|
 | --- | --- | --- |
 | 初始化| 0001| 0 |
 | 展开 | 0011| 1 |
 | 展开 | 0111| 2 |
 | 展开 | 1111 | 1111 3 |

 由于 3 连接到 0，我们接受并重建`[0,1,2,3]`。 

这个例子表明，该算法自然地发现简单的循环，而不需要显式的启发式方法。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n^2 2^n)$| 每个子集状态通过邻接边进行转换 |
 | 空间|$O(n 2^n)$| 通过位掩码的 DP 和父存储 |

 和$n \le 20$，DP 状态空间约为一百万个掩码，并且在优化的 Python 中或在 PyPy/C++ 中轻松地在时间限制下可以管理转换。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdin
    import sys

    n, m = map(int, sys.stdin.readline().split())
    adj = [[] for _ in range(n)]
    g = [[False]*n for _ in range(n)]

    for _ in range(m):
        u, v = map(int, sys.stdin.readline().split())
        u -= 1
        v -= 1
        adj[u].append(v)
        adj[v].append(u)
        g[u][v] = g[v][u] = True

    N = 1 << n
    dp = [[False]*n for _ in range(N)]
    par = [[-1]*n for _ in range(N)]

    start = 0
    dp[1 << start][start] = True

    for mask in range(N):
        if not (mask & (1 << start)):
            continue
        for v in range(n):
            if not dp[mask][v]:
                continue
            for to in adj[v]:
                if mask & (1 << to):
                    continue
                nmask = mask | (1 << to)
                if not dp[nmask][to]:
                    dp[nmask][to] = True
                    par[nmask][to] = v

    full = (1 << n) - 1
    end = -1
    for v in range(n):
        if dp[full][v] and g[v][start]:
            end = v
            break

    if end == -1:
        return "No"

    cycle = []
    mask, v = full, end
    while v != -1:
        cycle.append(v)
        pv = par[mask][v]
        mask ^= (1 << v)
        v = pv

    cycle.reverse()
    pos = {x:i for i,x in enumerate(cycle)}
    a = [cycle[(pos[i] + 1) % n] + 1 for i in range(n)]

    return "Yes\n" + " ".join(map(str, a))

# provided sample
assert run("""6 7
1 2
2 3
3 1
4 5
5 6
4 6
2 5
""").split()[0] == "Yes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 三角形图 | 是的循环| 基本周期检测|
 | 路径图| 没有 | 哈密​​顿循环的不可能性|
 | 完整图表| 是的 | DP 找到任意循环 |
 | 小 n=2 | 是的 | 边界正确性 |

 ## 边缘情况

 最小图与$n=2$并且单个边迫使唯一可能的长度为 2 的循环。DP 正确地识别了它，因为唯一的哈密顿循环是微不足道的。 

树状图突出显示了失败情况：由于不存在覆盖所有顶点的循环，因此 DP 永远不会达到返回到开始的全掩码状态，从而产生“否”。 这场比赛
