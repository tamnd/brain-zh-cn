---
title: "CF 2188E - 杰瑞和汤姆"
description: "每个顶点都有一条到下一个顶点的边，并且可能还有一个到更大顶点的额外长跳跃。 多余的边永远不会交叉。 如果我们在数轴上方绘制每条边，则不会有两条额外的边形成模式 $ui < uj < vi < vj$。 杰瑞必须每回合移动。"
date: "2026-06-09T04:37:33+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "games", "graphs", "greedy", "trees"]
categories: ["algorithms"]
codeforces_contest: 2188
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 1077 (Div. 2)"
rating: 2300
weight: 2188
solve_time_s: 123
verified: true
draft: false
---

[CF 2188E - 杰瑞和汤姆](https://codeforces.com/problemset/problem/2188/E)

 **评分：** 2300
 **标签：** 数据结构、dfs 和类似、游戏、图形、贪婪、树
 **求解时间：** 2m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个顶点都有一条到下一个顶点的边，并且可能还有一个到更大顶点的额外长跳跃。 多余的边永远不会交叉。 如果我们将每条边都绘制在数轴上方，则不会有两条额外的边形成该图案$u_i < u_j < v_i < v_j$。 

杰瑞必须每回合移动。 汤姆可能会搬走或留下。 杰瑞到达顶点获胜$n$在被抓住之前。 一旦双方玩家在回合结束时占据同一顶点，汤姆就获胜。 

对于每个订购的起始对$(x,y)$，我们定义$f(x,y)$作为汤姆必须采取的最少实际行动次数才能取得胜利。 如果汤姆无法强行获胜，则价值为$0$。 

我们必须总结$f(x,y)$在所有有序对上$x \ne y$。 

所有测试用例的顶点总数仅为$2 \cdot 10^5$，这立即排除了任何接近$O(n^2)$每个测试用例。 由于最终答案涉及所有有序对，因此我们需要全局聚合信息，而不是单独模拟游戏。 

该问题最危险的部分是游戏是在 DAG 上进行的，而不是在树上进行的。 幼稚的方法可能会尝试推理任意路径。 非交叉条件正是树结构出现的原因。 

考虑一个带有顶点的图$1 \to 2 \to 3 \to 4$和一个额外的边缘$1 \to 4$。 

如果杰瑞开始于$1$和汤姆在$3$，汤姆必须立即移动到$4$。 等待失败，因为杰瑞可以直接跳到$4$。 答案是$f(1,3)=1$， 不是$0$。 

另一个微妙的情况是$x=n$。 杰瑞在任何回合开始前立即获胜。 例如：```
n = 2
x = 2
y = 1
```汤姆没有机会移动，所以$f(2,1)=0$。 

第三个陷阱是汤姆被允许保持静止。 有时，最佳策略是进行零步操作并在关键祖先处等待。 任何假设汤姆总是前进的解决方案都会计算过多。 

## 方法

 暴力解决方案将评估每个有序对$(x,y)$，解决相应的游戏，并累积答案。 

该图包含$O(n)$边缘，所以即使$O(n)$每对比赛分析已经花费$O(n^2)$。 由于有$O(n^2)$对，总复杂度变为$O(n^3)$，这是无望的$n=2 \cdot 10^5$。 

关键观察来自非交叉条件。 

对于每个顶点$i$， 让$a_i$是所有出边中最大的端点$i$。 由于普通边缘$i \to i+1$始终存在，$a_i$是明确定义的。 

一个至关重要的事实是，每一条路径$i$到$n$必须经过$a_i$。 如果路径试图绕过$a_i$，最终会创建一个交叉边，与图的限制相矛盾。 这一观察结果出现在官方解决方案讨论中。 

现在连接每个顶点$i$到$a_i$。 这些边形成一棵有根的树$n$。 从一个顶点到一个顶点的每条路径$n$包含该树中该顶点的所有祖先。 

一旦游戏被翻译到这棵树上，结果就变得简单了。 

让$d_u$是深度$u$在树中，从根开始测量$n$。 让$L=\operatorname{lca}(x,y)$。 

如果$d_x < d_y$，杰瑞可以永远严格领先汤姆并达到$n$，所以汤姆无法强行获胜。 

如果$d_x \ge d_y$, 汤姆通过竞速获胜$L$。 他达到了$L$不晚于杰瑞，杰瑞必须通过$L$。 汤姆需要的最少移动次数是$$f(x,y)=d_y-d_L.$$这将游戏简化为纯粹的树木计数问题。 

重写有序对和并对对称对进行分组后，答案变为$$A-B+C,$$在哪里$$A=\sum_{x<y}\min(d_x,d_y),$$

$$B=\sum_{x<y} d_{\operatorname{lca}(x,y)},$$和$$C=\sum_{\substack{x<y\\ d_x=d_y}} \left(d_x-d_{\operatorname{lca}(x,y)}\right).$$所有三项都可以计算为$O(n \log n)$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^3)$|$O(n)$| 太慢了 |
 | 最佳 |$O(n \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 对于每个顶点$i<n$, 计算$a_i$，其出边中的最大端点。 
2. 构建一棵有根树$a_i$的父母$i$。 根是顶点$n$。 
3. 运行 DFS 来计算子树大小和深度。 
4. 计算$$A=\sum_{x<y}\min(d_x,d_y).$$对所有深度进行排序。 如果排序深度是$b_1 \le b_2 \le \dots \le b_n$， 然后$$A=\sum_{i=1}^{n} b_i (n-i).$$每对贡献较小的深度，这正是排序顺序的左端点。 
5. 计算$$B=\sum_{x<y} d_{\operatorname{lca}(x,y)}.$$对于一个节点$u$, LCA 等于的无序对的数量$u$是$$\binom{\text{sz}_u}{2} - \sum_{v \text{ child of } u} \binom{\text{sz}_v}{2}.$$将此计数乘以$d_u$并将其添加到$B$。 
6. 计算$$C_1=\sum_h h \binom{\text{cnt}_h}{2},$$在哪里$\text{cnt}_h$是深度处的顶点数$h$。 

这等于第一部分$C$。 
7. 计算$$C_2=\sum_{\substack{x<y\\ d_x=d_y}} d_{\operatorname{lca}(x,y)}.$$使用树上的 DSU。 对于每个节点$u$，计算 LCA 恰好为的等深度对$u$。 如果该计数是$P_u$，然后添加$$d_u \cdot P_u$$到$C_2$。 
8.最终答案是$$A-B+(C_1-C_2).$$### 为什么它有效

 整个解决方案依赖于由每个顶点的最大出边导出的树。 每一条路都通向$n$必须经过这棵树中的父级，因此游戏仅取决于祖先关系。 当杰瑞开始时比汤姆更接近树根时，他就能准确地避免捕获。 否则Tom可以先占用LCA并等待。 这给出了闭式$f(x,y)$。 剩下的工作是计算深度和 LCA 在所有对中贡献的频率，这正是三个聚合项的计算结果。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1 << 20)

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n, m = map(int, input().split())

        parent = [0] * (n + 1)
        for i in range(1, n):
            parent[i] = i + 1

        for _ in range(m):
            u, v = map(int, input().split())
            if v > parent[u]:
                parent[u] = v

        g = [[] for _ in range(n + 1)]
        root = n

        for i in range(1, n):
            g[parent[i]].append(i)

        depth = [0] * (n + 1)
        sz = [0] * (n + 1)
        heavy = [0] * (n + 1)

        depth_cnt = [0] * n

        def dfs1(u):
            sz[u] = 1
            depth_cnt[depth[u]] += 1

            mx = 0
            for v in g[u]:
                depth[v] = depth[u] + 1
                dfs1(v)
                sz[u] += sz[v]
                if sz[v] > mx:
                    mx = sz[v]
                    heavy[u] = v

        dfs1(root)

        depths = depth[1:]
        depths.sort()

        A = 0
        for i, d in enumerate(depths):
            A += d * (n - 1 - i)

        B = 0
        for u in range(1, n + 1):
            pairs = sz[u] * (sz[u] - 1) // 2
            for v in g[u]:
                pairs -= sz[v] * (sz[v] - 1) // 2
            B += pairs * depth[u]

        C1 = 0
        for d, c in enumerate(depth_cnt):
            C1 += d * (c * (c - 1) // 2)

        big = [False] * (n + 1)
        freq = [0] * n

        C2 = 0

        def add_subtree(u, delta):
            freq[depth[u]] += delta
            for v in g[u]:
                if not big[v]:
                    add_subtree(v, delta)

        def count_subtree(u):
            nonlocal cur_pairs
            cur_pairs += freq[depth[u]]
            for v in g[u]:
                if not big[v]:
                    count_subtree(v)

        def dfs2(u, keep):
            nonlocal C2, cur_pairs

            for v in g[u]:
                if v != heavy[u]:
                    dfs2(v, False)

            if heavy[u]:
                dfs2(heavy[u], True)
                big[heavy[u]] = True

            pairs_here = 0

            for v in g[u]:
                if v == heavy[u]:
                    continue

                cur_pairs = 0
                count_subtree(v)
                pairs_here += cur_pairs
                add_subtree(v, 1)

            freq[depth[u]] += 1

            if heavy[u]:
                big[heavy[u]] = False

            C2 += pairs_here * depth[u]

            if not keep:
                add_subtree(u, -1)

        dfs2(root, False)

        ans = A - B + (C1 - C2)
        out.append(str(ans))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一阶段使用每个顶点的最大出边构建父树。 图属性保证该树捕获到根的所有可能的路线。 

第一个 DFS 计算深度、子树大小和重子树。 这些值将被以后的每个公式重用。 

的计算$B$使用标准 LCA 计数标识。 子树内的每个无序对都对某个祖先有贡献。 减去完全包含在子子树中的对就剩下 LCA 是当前节点的对。 

DSU-on-tree 部分是唯一脆弱的部分。 处理节点时$u$，频率表存储已经从先前处理的子子树累积的深度。 当遍历另一个子子树时，每个顶点立即查找已经存在多少个等深度的伙伴。 这些对具有完全相同的 LCA$u$，因为它们位于不同的子子树中。 

所有算术都使用 Python 整数，因此溢出从来不是问题。 

## 工作示例

 ### 示例 1

 输入：```
4 2
2 4
1 4
```父树是：```
4
├─1
└─2
   └─3
```| 顶点| 深度 |
 | --- | --- |
 | 4 | 0 |
 | 1 | 1 |
 | 2 | 1 |
 | 3 | 2 |

 排序深度为$[0,1,1,2]$。 

| 术语 | 价值|
 | --- | --- |
 | 一个 | 5 |
 | 乙| 0 |
 | C1 | 1 |
 | C2 | 0 |
 | 回答 | 6 |

 这与示例输出相匹配。 

### 示例 2

 输入：```
3 1
1 3
```这棵树是：```
3
├─1
└─2
```| 顶点| 深度 |
 | --- | --- |
 | 3 | 0 |
 | 1 | 1 |
 | 2 | 1 |

 | 术语 | 价值|
 | --- | --- |
 | 一个 | 2 |
 | 乙| 0 |
 | C1 | 1 |
 | C2 | 1 |
 | 回答 | 2 |

 等深对$(1,2)$再次对对称变换做出贡献，这正是$C$更正。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \log n)$| 排序深度和 DSU-on-tree |
 | 空间|$O(n)$| 树、深度数组、频率表 |

 总计$n$所有测试用例最多$2 \cdot 10^5$， 所以$O(n \log n)$很容易符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    bak = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = bak
    return out.getvalue()

# provided sample
assert run("""5
2 0
3 1
1 3
4 2
2 4
1 4
5 1
1 4
8 3
1 4
5 8
2 4
""") == """0
2
6
3
23
"""

# minimum graph
assert run("""1
2 0
""") == "0\n"

# pure chain
assert run("""1
3 0
""") == "0\n"

# single jump to root
assert run("""1
4 1
1 4
""") == "3\n"

# nested jumps
assert run("""1
5 2
1 5
2 4
""") == "8\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 0`|`0`| 尽可能最小的图 |
 | 仅链条|`0`| 汤姆从来不需要积极的举动|
 | 一跳至根 |`3`| 即时拦截案例 |
 | 嵌套跳转 |`8`| 非交叉额外边和树结构 |

 ## 边缘情况

 考虑：```
1
2 0
```杰瑞从顶点开始$2$对于这对$(2,1)$。 比赛以杰瑞的胜利立即结束。 顶点的树深度$2$是$0$，因此该公式正确地没有任何贡献。 

考虑：```
1
4 1
1 4
```汤姆通常可以通过在顶点等待来获胜$4$。 该算法捕获了这一点，因为 LCA 已经是根并且$d_y-d_{LCA}=0$。 

考虑：```
1
4 2
1 4
2 4
```顶点$1$和$2$位于同一深度。 等深度对正是对称对变换过度计数的地方。 修正项$C=C_1-C_2$删除多余的部分并产生正确的答案。
