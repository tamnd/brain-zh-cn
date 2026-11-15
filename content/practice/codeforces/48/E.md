---
title: "CF 48E - 愚者伊凡 VS 龙戈里尼奇"
description: "游戏状态完全由两个数字来描述：龙​​当前有多少个头和多少个尾巴。 在状态 (h, t) 中，Ivan 可以选择两种移动类型之一。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "games", "graphs"]
categories: ["algorithms"]
codeforces_contest: 48
codeforces_index: "E"
codeforces_contest_name: "School Personal Contest #3 (Winter Computer School 2010/11) - Codeforces Beta Round 45 (ACM-ICPC Rules)"
rating: 2100
weight: 48
solve_time_s: 141
verified: true
draft: false
---

[CF 48E - 傻瓜伊凡 VS 龙戈里尼奇](https://codeforces.com/problemset/problem/48/E)

 **评分：** 2100
 **标签：** dp、游戏、图表
 **求解时间：** 2m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 游戏状态完全由两个数字来描述：龙当前有多少个头和多少个尾巴。 来自一个州`(h, t)`Ivan 可以选择两种移动类型之一。 

如果他砍`i`头，在哪里`1 ≤ i ≤ n`和`i ≤ h`，然后龙又长回来了`headGrow[i]`头和`tailGrow[i]`尾巴。 新的状态变为：`(h - i + headGrow[i], t + tailGrow[i])`如果他砍`i`尾巴，哪里`1 ≤ i ≤ m`和`i ≤ t`，那么新的状态就变成：`(h + headGrowTail[i], t - i + tailGrowTail[i])`战斗立即以三种方式之一结束。 

如果该州变成，伊万获胜`(0, 0)`再生后。 

如果一次移动后零件总数超过，则龙获胜`R`。 

如果伊万能够永远避免失败，但永远无法强行获胜，那么这场比赛就是平局。 

棘手的是，伊万总是在三级目标下发挥最佳水平。 首先，他更喜欢以最少的步数获胜。 如果不可能获胜，他宁愿永远活下去。 如果连这都不可能的话，他也想尽可能拖延失败的时间。 

界限足够小，可以处理每个有效的`(h, t)`作为图形节点对。 自从`h + t ≤ R ≤ 200`，可达合法状态的总数最多约为`201 × 201`，但仅说明`h + t ≤ R`事情。 这大致给出了`O(R²)`最坏的情况下，大约有四万个州。 每个州最多有`n + m ≤ 400`传出转换。 覆盖所有状态的图算法是完全可行的。 

没有记忆的简单递归模拟会失败，因为游戏图包含循环。 例如，假设砍掉一个头只会重新生成一个头。 然后状态永远不会改变并且递归永远循环。 

当伊万可以永远生存但无法到达时，就会出现微妙的边缘情况`(0,0)`。 

例子：```
1 0 5
1
1 0
1
0 0
```从`(1,0)`，砍掉一个头会回到`(1,0)`。 伊万永远不会输，因为总数永远不会超过`R`，但他也从未获胜。 正确的输出是：```
Draw
```最短路径搜索仅寻找`(0,0)`会错误地得出伊万输了的结论。 

另一个重要的边缘情况是当每个可能的移动立即超过`R`。 

例子：```
1 0 1
1
2 0
1
0 0
```切割一个头产生`(2,0)`，其总数超过`R`。 伊万立刻就输了：```
Zmey
1
```粗心的实施有时会忘记超过`R`是立即的终端损失并意外地将这些状态插入到图中。 

一种更微妙的情况是，伊万无法避免最终的失败，但不同的选择会延迟不同程度的失败。 

例子：```
1 0 3
1
2 0
1
0 0
```唯一的举动是：`(1,0) → (2,0) → (3,0) → lose`答案是：```
Zmey
3
```打印的数字是伊万在不可避免的损失之前可以生存的最大移动次数。 

## 方法

 最直接的想法就是查看每个状态`(h,t)`作为一个节点并递归地探索所有可能的动作。 如果移动达到`(0,0)`，伊万获胜。 如果每一步最终都超过`R`，龙胜。 如果存在某种循环，游戏可能会永远继续下去。 

这种递归方法在逻辑上是正确的，因为游戏在合法区域内是有限的`h + t ≤ R`。 问题在于，仅靠递归无法区分有用的重访和无限循环。 重复访问同一状态的 DFS 可能永远不会终止。 即使有记忆，正确处理周期也会变得复杂，因为游戏不是简单的输赢游戏，它具有三个具有优化标准的结果。 

关键的观察结果是，合法状态形成一个最多有大约四万个节点的有向图。 一旦我们用图的方式思考，问题就会自然地分解为三个独立的图问题。 

首先判断Ivan是否可以到达`(0,0)`在离开合法区域之前。 由于每一步都要花费一步，因此这只是未加权图中的最短路径。 

如果不可能获胜，就决定伊万能否永远活下去。 当某个周期可以从起始状态到达并且完全保持在合法区域内时，就会发生这种情况。 

如果既不可能获胜也不可能无限生存，则从一开始可到达的图就是一个以失败退出结束的 DAG。 在这种情况下，Ivan 想要尽可能长的生存时间，这将成为 DAG 中的最长路径。 

状态图的结构是使这种分解起作用的原因。 每个合法的移动都停留在有界状态空间内，除非龙立即获胜。 这种有界性允许标准图算法完全表征游戏。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力DFS | 指数| 指数递归树| 太慢了|
 | 最优图+BFS+​​环检测+DP | O(R²(n+m)) | O(R²) | 已接受 |

 ## 算法演练

 1. 生成各个合法状态`(h,t)`这样`h + t ≤ R`。 

这些是唯一可以继续战斗的州。 任何产生更大总数的举动都意味着立即失败。 
2. 在法律状态之间建立定向过渡。 

对于每个状态，尝试所有可能的头切和尾切。 如果结果状态仍然满足`h + t ≤ R`，为其添加一条边。 否则，该举动将被视为立即失败退出。 
3. 从初始状态运行 BFS 来计算最短距离。 

由于每次移动都需要一次打击，因此 BFS 给出了到达每个可到达状态的最小移动次数。 
4. 如果`(0,0)`可达，打印`"Ivan"`和 BFS 距离。 

BFS 保证这是尽可能少的打击次数。 
5. 否则，检查可达子图是否包含环。 

使用三种颜色运行 DFS：`0 = unvisited`

`1 = currently in recursion stack`

`2 = fully processed`遇到带有颜色的节点的边`1`表示存在可达环。 
6. 如果存在可达循环，则打印`"Draw"`。 

伊万可以永远留在这个循环中并无限期地避免失败。 
7. 否则，可达图是非循环的。 

每条路径最终都必须在超过的移动处终止`R`。 
8. 计算 DAG 上 DP 的最长生存时间。 

定义`dp[state]`as the maximum number of moves before defeat starting from that state.

 对于一个没有外出合法举动的州来说，`dp = 1`因为下一步立即就输了。 

否则：`dp[state] = 1 + max(dp[next_state])`9. 打印`"Zmey"`和`dp[start]`。 

这是在失败不可避免的情况下，伊万能活下来的最大步数。 

### 为什么它有效

 该算法将所有可能的游戏准确地划分为三类。 

如果`(0,0)`是可达的，BFS 找到最短的获胜序列，因为每条边的成本相等。 

如果`(0,0)`不可达，但存在可达循环，Ivan 可以通过循环该循环来永远保持在合法状态内。 因为失败只有在超过时才会发生`R`，这样的循环保证了无限的生存。 

如果两个条件都不成立，则可达图是有限 DAG。 每场比赛最终都会陷入死胡同，所有的动作都会立即失败。 DAG 上的动态编程计算最大可能的生存长度，因为每个状态都会在所有合法移动中选择最佳的延续。 

这三种情况是相互排斥的，涵盖了每一种可能的游戏演变。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

INF = 10**18

def solve():
    H, T, R = map(int, input().split())

    n = int(input())
    head = [(0, 0)] * (n + 1)
    for i in range(1, n + 1):
        head[i] = tuple(map(int, input().split()))

    m = int(input())
    tail = [(0, 0)] * (m + 1)
    for i in range(1, m + 1):
        tail[i] = tuple(map(int, input().split()))

    states = []
    for h in range(R + 1):
        for t in range(R + 1 - h):
            states.append((h, t))

    graph = {}
    for h, t in states:
        nxt = []

        for i in range(1, min(n, h) + 1):
            nh = h - i + head[i][0]
            nt = t + head[i][1]

            if nh + nt <= R:
                nxt.append((nh, nt))

        for i in range(1, min(m, t) + 1):
            nh = h + tail[i][0]
            nt = t - i + tail[i][1]

            if nh + nt <= R:
                nxt.append((nh, nt))

        graph[(h, t)] = nxt

    start = (H, T)
    target = (0, 0)

    dist = {start: 0}
    q = deque([start])

    while q:
        v = q.popleft()

        for to in graph[v]:
            if to not in dist:
                dist[to] = dist[v] + 1
                q.append(to)

    if target in dist:
        print("Ivan")
        print(dist[target])
        return

    color = {}
    has_cycle = False

    def dfs(v):
        nonlocal has_cycle

        color[v] = 1

        for to in graph[v]:
            if to not in dist:
                continue

            if color.get(to, 0) == 0:
                dfs(to)
            elif color[to] == 1:
                has_cycle = True

        color[v] = 2

    dfs(start)

    if has_cycle:
        print("Draw")
        return

    dp = {}

    def longest(v):
        if v in dp:
            return dp[v]

        if not graph[v]:
            dp[v] = 1
            return 1

        best = 0
        for to in graph[v]:
            best = max(best, longest(to))

        dp[v] = best + 1
        return dp[v]

    print("Zmey")
    print(longest(start))

solve()
```图表的构建遵循严格的游戏规则。 每个合法状态仅存储仍在允许总数内的转换`R`。 动作超过`R`被故意排除，因为它们代表立即失败，而不是另一种可玩的状态。 

BFS部分首先解决获胜的情况，因为伊万总是更喜欢获胜而不是平局或推迟失败。 使用 BFS 而不是 DFS 很重要，因为答案需要最少的打击次数。 

循环检测DFS仅遍历从一开始就可达的状态。 如果 Ivan 无法进入，则图中其他位置的循环是无关紧要的。 三色 DFS 是检测有向循环的标准方法。 看到递归堆栈中已有节点意味着我们找到了后沿，从而出现了无限循环。 

最长路径 DP 之所以起作用，只是因为在排除抽签情况后，保证图是非循环的。 如果没有这个属性，递归将永远循环。 没有传出法律边缘的国家返回`1`因为伊万在立即失败之前还有最后一步。 

一个微妙的细节是检查的顺序。 我们必须测试可达性`(0,0)`检查周期之前。 如果伊万已经有了获胜策略，那么可达到的周期并不重要，因为他总是更喜欢获胜。 

## 工作示例

 ### 示例 1

 输入：```
2 2 4
2
1 0
0 1
3
0 1
0 1
0 0
```状态转换：

 | 当前状态 | 移动| 下一个状态 |
 | ---| ---| ---|
 | (2,2) | 剪2条尾巴| (2,1) |
 | (2,1) | 砍1头| (2,1) |
 | (2,1) | 剪1条尾巴| (2,1) |
 | (2,1) | 剪掉3条尾巴是不可能的| - |
 | (2,1) | 砍2个头| (0,2) |
 | (0,2) | 剪2条尾巴| (0,1)|
 | (0,1)| 剪1条尾巴| (0,0) | (0,0) |

 最短获胜序列：

 | 步骤| 状态|
 | ---| ---|
 | 0 | (2,2) |
 | 1 | (0,2) |
 | 2 | (0,0) | (0,0) |

 输出：```
Ivan
2
```此跟踪显示了为什么 BFS 是必要的。 存在多个循环，但 BFS 仍然找到最短路径获胜。 

### 示例 2

 输入：```
1 0 5
1
1 0
1
0 0
```可到达的状态：

 | 步骤| 状态|
 | ---| ---|
 | 0 | (1,0)|
 | 1 | (1,0)|
 | 2 | (1,0)|
 | ... | ... |

 唯一的举动永远返回到相同的状态。 

输出：```
Draw
```这演示了循环条件。 伊万无法获胜，但他可以无限期地避免失败。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(R²(n+m)) | 每个合法国家都会尝试所有头尾操作|
 | 空间| O(R²) | Graph、BFS、DFS、DP存储每个状态的信息 |

 和`R ≤ 200`，州的数量最多也就四万左右。 每个状态最多处理四百个转换。 整个工作完全符合 Python 的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    H, T, R = map(int, input().split())

    n = int(input())
    head = [(0, 0)] * (n + 1)
    for i in range(1, n + 1):
        head[i] = tuple(map(int, input().split()))

    m = int(input())
    tail = [(0, 0)] * (m + 1)
    for i in range(1, m + 1):
        tail[i] = tuple(map(int, input().split()))

    states = []
    for h in range(R + 1):
        for t in range(R + 1 - h):
            states.append((h, t))

    graph = {}
    for h, t in states:
        nxt = []

        for i in range(1, min(n, h) + 1):
            nh = h - i + head[i][0]
            nt = t + head[i][1]

            if nh + nt <= R:
                nxt.append((nh, nt))

        for i in range(1, min(m, t) + 1):
            nh = h + tail[i][0]
            nt = t - i + tail[i][1]

            if nh + nt <= R:
                nxt.append((nh, nt))

        graph[(h, t)] = nxt

    start = (H, T)
    target = (0, 0)

    dist = {start: 0}
    q = deque([start])

    while q:
        v = q.popleft()

        for to in graph[v]:
            if to not in dist:
                dist[to] = dist[v] + 1
                q.append(to)

    out = []

    if target in dist:
        out.append("Ivan")
        out.append(str(dist[target]))
        return "\n".join(out)

    color = {}
    has_cycle = False

    def dfs(v):
        nonlocal has_cycle

        color[v] = 1

        for to in graph[v]:
            if to not in dist:
                continue

            if color.get(to, 0) == 0:
                dfs(to)
            elif color[to] == 1:
                has_cycle = True

        color[v] = 2

    dfs(start)

    if has_cycle:
        return "Draw"

    dp = {}

    def longest(v):
        if v in dp:
            return dp[v]

        if not graph[v]:
            dp[v] = 1
            return 1

        best = 0
        for to in graph[v]:
            best = max(best, longest(to))

        dp[v] = best + 1
        return dp[v]

    out.append("Zmey")
    out.append(str(longest(start)))

    return "\n".join(out)

# provided sample
assert run(
"""2 2 4
2
1 0
0 1
3
0 1
0 1
0 0
"""
) == "Ivan\n2", "sample 1"

# draw loop
assert run(
"""1 0 5
1
1 0
1
0 0
"""
) == "Draw", "infinite cycle"

# immediate loss
assert run(
"""1 0 1
1
2 0
1
0 0
"""
) == "Zmey\n1", "forced immediate defeat"

# shortest win
assert run(
"""1 1 3
1
0 0
1
0 0
"""
) == "Ivan\n2", "minimal winning path"

# longer forced survival
assert run(
"""1 0 3
1
2 0
1
0 0
"""
) == "Zmey\n3", "maximize survival time"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 无限自循环| 画 | 可达周期检测|
 | 立即溢出 | 兹梅 1 | 失败的动作不会添加为状态 |
 | 小直赢| 伊万 2 | BFS 最短路径正确性 |
 | 成长链| 兹梅伊 3 | 最长生存期 DP |
 | 官方样品| 伊万 2 | 全面整合 |

 ## 边缘情况

 考虑自循环情况：```
1 0 5
1
1 0
1
0 0
```从`(1,0)`，砍掉一颗头会再生一颗头。 BFS永远达不到`(0,0)`。 DFS随后访问`(1,0)`并立即找到一条回到递归堆栈中已有节点的边。 该算法打印：```
Draw
```这正确地捕捉到了无限的生存。 

现在考虑立即失败：```
1 0 1
1
2 0
1
0 0
```唯一的转变是：`(1,0) → (2,0)`自从`2 > R`，这条边被从图中排除。 起始状态没有合法的传出边缘。 BFS无法到达`(0,0)`，DFS找不到环，DP返回`1`。 该算法打印：```
Zmey
1
```答案正确地计算了最后失败的一步。 

最后，考虑不可避免但延迟的失败：```
1 0 3
1
2 0
1
0 0
```可到达的状态有：`(1,0) → (2,0) → (3,0)`从`(3,0)`，每一步都超过`R`。 该图是非循环的，因此 DP 计算：

 | 状态| DP |
 | ---| ---|
 | (3,0) | 1 |
 | (2,0) | 2 |
 | (1,0)| 3 |

 输出变为：```
Zmey
3
```这证实了当失败无法避免时，该算法可以最大化生存长度。
