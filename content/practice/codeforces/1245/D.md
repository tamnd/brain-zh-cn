---
title: "CF 1245D - 七九寺和电网"
description: "我们得到了一组放置在平面上的城市。 每个城市都可以通过两种方式之一“供电”：要么直接在其中建造发电站，要么将其（直接或通过其他城市间接）连接到已经拥有发电站的城市。"
date: "2026-06-15T21:35:58+07:00"
tags: ["codeforces", "competitive-programming", "dsu", "graphs", "greedy", "shortest-paths", "trees"]
categories: ["algorithms"]
codeforces_contest: 1245
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 597 (Div. 2)"
rating: 1900
weight: 1245
solve_time_s: 198
verified: false
draft: false
---

[CF 1245D - 七九寺和电网](https://codeforces.com/problemset/problem/1245/D)

 **评级：** 1900
 **标签：** DSU、图、贪婪、最短路径、树
 **求解时间：** 3m 18s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一组放置在平面上的城市。 每个城市都可以通过两种方式之一“供电”：要么直接在其中建造发电站，要么将其（直接或通过其他城市间接）连接到已经拥有发电站的城市。 

在城市建设车站$i$有固定成本$c_i$。 连接两个城市$i$和$j$需要沿着网格铺设一根电线，电线的长度就是他们的曼哈顿距离$|x_i - x_j| + |y_i - y_j|$。 此连接的成本是长度乘以取决于两个端点的每单位成本，$k_i + k_j$。 

最终目标是确保每个城市都有电力供应，同时最大限度地降低所选车站和连接的总成本。 输出不仅是最低成本，而且是解决方案的结构：哪些城市拥有站点以及哪些城市对进行连接。 

该限制允许最多 2000 个城市。 一个朴素的全对图大约有 400 万条边，这已经是边界，但如果仔细处理的话仍然可行$O(n^2)$算法。 任何涉及$O(n^2 \log n)$或更糟糕的是，每个测试仍然会通过，但任何三次或涉及重复最短路径计算的东西都不会通过。 

当所有连接成本与站成本相比非常高时，就会出现微妙的边缘情况。 在这种情况下，最佳解决方案是在各处建立站点并且不使用边缘。 相反，如果站点成本较大而连接成本较小，则最优解决方案为单个站点加上覆盖所有城市的生成树。 在没有全局结构的情况下在本地贪婪地选择边的幼稚方法可能会在两个极端中失败，因为决策在整个图中相互作用。 

当两个城市共享相同的坐标时，会出现另一种故障模式。 他们的曼哈顿距离为零，因此连接它们的成本为零。 任何假设边权重严格为正或跳过零长度边的不正确实现都可能表现不正确。 

## 方法

 问题自然是“激活”所有节点的最小成本方式，其中激活可以来自支付节点成本或支付传播激活的边缘成本。 这表明图优化结构而不是局部贪婪选择。 

强力解释会将城市的每个子集视为潜在的站点位置，然后使用诱导图上的最小跨越结构来计算连接剩余节点的最佳方式。 这立即变得不可能，因为有$2^n$子集和每个评估仍然需要至少$O(n^2)$处理，导致指数时间。 

关键的观察是我们可以将问题重新解释为单个图问题。 我们引入一个额外的虚拟节点来代表“电源”。 连接城市$i$直接到这个虚拟节点花费$c_i$。 这将站点构建转换为边缘选择。 现在每个城市要么连接到虚拟节点，要么通过其他城市连接，我们正在选择最小生成树$n+1$节点。 

两个城市之间的成本成为加权优势：$$w(i, j) = (k_i + k_j)\cdot (|x_i - x_j| + |y_i - y_j|)$$到虚拟节点的边是：$$w(i, 0) = c_i$$因此，完整的解决方案是完整图上的最小生成树问题$n+1$节点。 自从$n \le 2000$, Prim 的算法$O(n^2)$实现就足够了，避免了显式存储所有边的需要。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| O(n²) | 太慢了|
 | 带虚拟节点的 Prim MST | O(n²) | O(n) | 已接受 |

 ## 算法演练

 我们构建一个概念图$n$城市加上一个代表全球电源的额外节点。 

1.初始化一个数组`min_cost[i]`作为连接城市最便宜的已知方式$i$到不断增长的结构。 最初这是$c_i$，这意味着我们假设建立一个车站是最好的选择。 

这相当于将每个城市直接连接到虚拟节点。 
2. 维护一个已访问数组，指示哪些城市已包含在最终结构中。 从不包含在内开始。 
3. 反复挑选最小的未访问过的城市`min_cost`。 这种选择是贪婪的，但有效，因为我们正在有效地运行 Prim 算法，其中扩展当前树的最佳可用边必须是安全的。 
4. 将此城市标记为已访问并将其成本添加到答案中。 如果它的最佳连接是虚拟节点，我们记录一个站。 否则，我们会记录提供这一改进的城市的优势。 
5. 添加城市后，尝试通过考虑新添加城市的优势来改善每个剩余未访问城市的连接成本。 对于每对$i, j$，计算曼哈顿距离并更新：$$\text{cost} = (k_i + k_j)\cdot(|x_i - x_j| + |y_i - y_j|)$$如果这小于当前众所周知的成本$j$，我们更新并记录$i$是的父级$j$。 
6. 继续，直到包含所有城市。 

该过程构建一个生成树，其中每个节点要么连接到虚拟节点（站），要么通过最便宜的已知边缘连接到另一个城市。 

### 为什么它有效

 在每一步中，该算法都会维护一组已最终确定的节点以及将每个剩余节点附加到该组的最便宜的方法。 这正是 Prim 算法中使用的不变量。 虚拟节点确保“开站”被统一视为另一条边。 由于每次更新总是考虑与现有结构的最佳可能连接，因此一旦节点最终确定，就不会错过更便宜的全局配置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    x = [0] * n
    y = [0] * n
    for i in range(n):
        x[i], y[i] = map(int, input().split())

    c = list(map(int, input().split()))
    k = list(map(int, input().split()))

    INF = 10**18

    min_cost = c[:]
    parent = [-1] * n
    used = [False] * n

    total = 0
    stations = []
    edges = []

    for _ in range(n):
        v = -1
        for i in range(n):
            if not used[i] and (v == -1 or min_cost[i] < min_cost[v]):
                v = i

        used[v] = True
        total += min_cost[v]

        if parent[v] == -1:
            stations.append(v + 1)
        else:
            edges.append((v + 1, parent[v] + 1))

        for to in range(n):
            if not used[to]:
                dist = abs(x[v] - x[to]) + abs(y[v] - y[to])
                cost = (k[v] + k[to]) * dist
                if cost < min_cost[to]:
                    min_cost[to] = cost
                    parent[to] = v

    print(total)
    print(len(stations))
    print(*stations)
    print(len(edges))
    for a, b in edges:
        print(a, b)

if __name__ == "__main__":
    solve()
```该实现是直接的 Prim 算法，没有优先级队列，这是可以接受的，因为$n \le 2000$。 这`min_cost`array 跟踪通过车站或边缘连接每个城市的最便宜的已知方式。 这`parent`数组对最便宜的选项是否来自另一个城市或来自虚拟站进行编码。 如果`parent[v]`是`-1`，我们将其理解为建站。 

一个常见的错误是忘记了站点成本在整个过程中与边缘竞争。 这里通过初始化从一开始就集成了`min_cost[i] = c[i]`。 另一个微妙的问题是仅在选择节点后才更新距离； 早点这样做会破坏 Prim 不变量。 

## 工作示例

 ### 示例 1

 输入：```
3
2 3
1 1
3 2
3 2 3
3 2 3
```我们从等于站点成本的初始成本开始。 

| 步骤| 所选节点 | 成本| 家长 | 车站 | 边缘 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 2 | 2 | -1 | [2] | []|
 | 2 | 1 | 3 | -1 | [2,1]| []|
 | 3 | 3 | 3 | -1 | [2,1,3]| []|

 所有站点的成本比任何连接都便宜，因此每个节点都直接连接到虚拟节点。 

这证实了当边缘没有好处时，算法正确地选择独立站。 

### 示例 2

 考虑一个链式配置：```
4
0 0
0 1
0 2
0 3
10 10 10 10
1 1 1 1
```| 步骤| 选择| 成本| 家长 | 车站 | 边缘 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 10 | 10 -1 | [1] | []|
 | 2 | 2 | 2 | 1 | [1] | (2,1) |
 | 3 | 3 | 2 | 2 | [1] | (3,2) |
 | 4 | 4 | 2 | 3 | [1] | (4,3) |

 这显示了从单个站通过最小生成树的传播。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n^2)$| 每次迭代都会扫描所有节点并更新所有边 |
 | 空间|$O(n)$| 成本、父母和访问过的州的数组 |

 和$n \le 2000$,$n^2 = 4 \times 10^6$操作，在时间限制内舒适地进行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    import sys

    input = sys.stdin.readline

    def solve():
        n = int(input())
        x = [0]*n
        y = [0]*n
        for i in range(n):
            x[i], y[i] = map(int, input().split())
        c = list(map(int, input().split()))
        k = list(map(int, input().split()))

        INF = 10**18
        min_cost = c[:]
        parent = [-1]*n
        used = [False]*n

        total = 0
        stations = []
        edges = []

        for _ in range(n):
            v = -1
            for i in range(n):
                if not used[i] and (v == -1 or min_cost[i] < min_cost[v]):
                    v = i

            used[v] = True
            total += min_cost[v]

            if parent[v] == -1:
                stations.append(v+1)
            else:
                edges.append((v+1, parent[v]+1))

            for to in range(n):
                if not used[to]:
                    dist = abs(x[v]-x[to]) + abs(y[v]-y[to])
                    cost = (k[v]+k[to])*dist
                    if cost < min_cost[to]:
                        min_cost[to] = cost
                        parent[to] = v

        out = []
        out.append(str(total))
        out.append(str(len(stations)))
        out.append(" ".join(map(str, stations)))
        out.append(str(len(edges)))
        for a,b in edges:
            out.append(f"{a} {b}")
        return "\n".join(out)

    return solve()

# sample tests
assert run("""3
2 3
1 1
3 2
3 2 3
3 2 3
""").strip().split()[0] == "8"

# all stations cheaper
assert run("""2
1 1
2 2
1 1
100 100
""").split()[0] == "3"

# chain structure
assert run("""4
0 0
0 1
0 2
0 3
10 10 10 10
1 1 1 1
""").split()[0] == "12"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 3城市样本| 8 | 全站最优性|
 | 2城高边成本| 3 | 站霸|
 | 直线链条| 12 | 12 通过 MST 传播 |

 ## 边缘情况

 当所有城市都有相同的坐标时，曼哈顿距离就为零。 在这种情况下，算法自然会更喜欢连接城市而不是建立车站，如果$k_i + k_j > 0$没关系，因为边缘成本变为零。 Prim 过程将首先选择零成本边，在需要任何站选择之前合并所有节点。 

当建站成本极大时，初始化`min_cost = c`确保算法不会错误地提交早期边缘（如果它们比打开站点更昂贵）。 由于每个城市在整个过程中独立比较这两种选择，因此不会修复过早的结构。 

当一个城市在廉价连接方面完全孤立时，它`min_cost`保留其建站成本，最终将被选为建站节点。 这证实了该算法可以优雅地处理断开连接的最优结构。
