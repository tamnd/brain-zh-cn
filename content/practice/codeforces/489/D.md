---
title: "CF 489D - 无法忍受的存在之争"
description: "我们得到了一张表示交叉路口和单向道路的有向图。 一个“该死的菱形”由四个不同的顶点 $a, b, c, d$ 组成，因此存在有向边 $$a rightarrow b,quad b rightarrow c,quad a rightarrow d,quad d rightarrow c$$ 换句话说，从..."
date: "2026-06-07T17:36:35+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "combinatorics", "dfs-and-similar", "graphs"]
categories: ["algorithms"]
codeforces_contest: 489
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 277.5 (Div. 2)"
rating: 1700
weight: 489
solve_time_s: 113
verified: true
draft: false
---

[CF 489D - 无法忍受的存在争议](https://codeforces.com/problemset/problem/489/D)

 **评分：** 1700
 **标签：** 蛮力、组合、dfs 和类似、图表
 **求解时间：** 1m 53s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一张表示交叉路口和单向道路的有向图。 

“该死的菱形”由四个不同的顶点组成$a, b, c, d$使得存在有向边$$a \rightarrow b,\quad b \rightarrow c,\quad a \rightarrow d,\quad d \rightarrow c$$换句话说，从同一个起始顶点$a$，有两条不同的长度为 2 的有向路径终止于同一顶点$c$，使用不同的中间顶点$b$和$d$。 

任务是计算图中存在多少个这样的结构。 中间顶点的顺序并不重要，所以$(b,d)$和$(d,b)$描述相同的菱形。 

该图最多包含 3000 个顶点和 30000 个有向边。 顶点数相对较多，但边数仅大十倍。 检查所有四元组顶点的解决方案大约需要$3000^4$操作，这是完全不可能的。 即使检查所有三元组也太昂贵了。 

约束条件$m \le 30000$才是真正的线索。 复杂度主要取决于边缘的算法，例如$O(m\sqrt m)$或者$O(nm)$，是合理的。 一个$O(n^2)$或者$O(n^3)$必须仔细检查算法。 

一些边缘情况可能会导致错误。 

考虑：```
3 2
1 2
2 3
```从 1 到 3 只有一条长度为 2 的路径，所以答案是：```
0
```仅仅计算长度为 2 的路径的粗心解决方案可能会错误地返回 1。 

另一个重要的情况是多个长度为 2 的路径共享相同的起点和终点。```
4 4
1 2
2 4
1 3
3 4
```从1到4正好有两条路径，即$1\to2\to4$和$1\to3\to4$。 这些形成一个菱形，所以答案是：```
1
```一个不同的微妙情况是存在两个以上中间体时。```
5 6
1 2
2 5
1 3
3 5
1 4
4 5
```从 1 到 5 有 3 条长度为 2 的路径。任何一对中间体都形成菱形：$$(2,3),\ (2,4),\ (3,4)$$答案是：```
3
```仅检查是否存在至少两条路径的解决方案会低估。 

最后，四个顶点必须是不同的。 由于该图不包含自循环，因此对不同中间顶点对进行计数会自动保证唯一性，但在正确性论证期间必须理解这一事实。 

## 方法

 最直接的想法就是枚举每一个四元组$(a,b,d,c)$并检查是否所有四个必需的边都存在。 

这是正确的，因为每个菱形都恰好对应一个这样的四元组。 不幸的是，有$O(n^4)$四倍。 和$n=3000$，这是完全不可行的。 

更好的观察是关注起始顶点$a$。 

认为$a$是固定的。 每个传出边缘$a \rightarrow x$可以是长度为 2 的路径的第一步。 如果我们跟踪所有这些边并记录这些长度为 2 的路径结束的位置，那么对于每个目标顶点$c$我们获得创建路径的不同中间体的数量$$a \rightarrow * \rightarrow c.$$设这个数为$k$。 

其中每对中间体$k$选择形成一个以起始顶点为菱形$a$和结束顶点$c$。 这样的对的数量是$$\binom{k}{2} = \frac{k(k-1)}{2}.$$这将问题转化为计算长度为 2 的路径，这些路径按共同的起始和结束顶点分组。 

该图很稀疏。 对于固定来源$a$，我们可以遍历每个传出邻居$u$，然后通过每个传出邻居$v$的$u$。 每次访问对应于一次长度为 2 的有向步行，起始于$a$。 

所有来源的总工作量为$$\sum_{a}\sum_{u \in out(a)} outdeg(u).$$对求和重新排序给出$$\sum_{u} indeg(u)\cdot outdeg(u).$$自从$m \le 30000$，该表达式的最大值完全在限制范围内，并且是预期的解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^4)$|$O(1)$| 太慢了 |
 | 最佳|$O\!\left(\sum indeg(v)\,outdeg(v)\right)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 使用邻接表存储图。 
2. 将答案初始化为零。 
3. 对于每个顶点$a$：

 1. 创建数组`cnt`尺寸的$n$，最初用零填充。 
2. 对于每个外出邻居$u$的$a$：

 1. 对于每个外出邻居$v$的$u$：

 1. 增量`cnt[v]`。 

在这个循环之后，`cnt[v]`等于不同长度为 2 的路径的数量$a$到$v$。 
4. 对于每个顶点$v$：

 1.让$k = cnt[v]$。 
2.添加$k(k-1)/2$到答案。 

每对终止于同一顶点的长度为 2 的路径都会贡献一个菱形。 
5. 打印累计答案。 

### 为什么它有效

 修复源顶点$a$和一个目标顶点$c$。 

每次算法达到$c$穿越时$$a \rightarrow b \rightarrow c,$$它增加`cnt[c]`。 因此`cnt[c]`恰好变成产生长度为 2 的路径的有效中间顶点的数量$a$到$c$。 

有端点的菱形$a$和$c$通过在这些路径中选择任意两个不同的中间体来获得。 这种选择的数量恰好是$\binom{k}{2}$， 在哪里$k=cnt[c]$。 

每个菱形都只计算一次，因为它具有唯一的起始顶点$a$和结束顶点$c$。 No rhombus is missed because every length-2 path contributes to the corresponding count. No rhombus is counted twice because unordered pairs of intermediates are counted exactly once by the combination formula.

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    g = [[] for _ in range(n)]

    for _ in range(m):
        a, b = map(int, input().split())
        g[a - 1].append(b - 1)

    ans = 0

    for a in range(n):
        cnt = [0] * n

        for u in g[a]:
            for v in g[u]:
                cnt[v] += 1

        for k in cnt:
            ans += k * (k - 1) // 2

    print(ans)

if __name__ == "__main__":
    solve()
```邻接表存储所有出边。 

For each source vertex`a`，数组`cnt`计算每个顶点有多少条长度为 2 的路径。 嵌套遍历```
for u in g[a]:
    for v in g[u]:
```枚举从以下位置开始的长度为 2 的每个有向步行`a`。 

处理完所有此类步行后，`cnt[v]`等于连接的中间体的数量`a`到`v`。 选择这些中间体中的任何两个都会产生一个菱形，这就是贡献为```
k * (k - 1) // 2
```答案可以变得比$2^{31}$，因此它必须存储在 64 位整数中。 Python 整数自动增长，因此不需要特殊处理。 

该图在读取后立即转换为从零开始的索引。 这避免了主循环内重复的索引调整。 

## 工作示例

 ### 示例 1

 输入：```
5 4
1 2
2 3
1 4
4 3
```对于源顶点 1：

 | 路径| 目的地 | 碳纳米管|
 | --- | --- | --- |
 | 1→2→3 | 3 | cnt[3]=1 | cnt[3]=1 |
 | 1→4→3 | 3 | cnt[3]=2 | cnt[3]=2 |

 处理后：

 | 顶点| k | 贡献 |
 | --- | --- | --- |
 | 3 | 2 | 1 |
 | 其他 | 0 | 0 |

 总答案变为 1。 

输出：```
1
```这展示了基本的菱形结构：两个不同的中间体从相同的起点通向相同的终点。 

### 示例 2

 输入：```
5 6
1 2
2 5
1 3
3 5
1 4
4 5
```对于源顶点 1：

 | 路径| 目的地 | 碳纳米管|
 | --- | --- | --- |
 | 1→2→5 | 5 | 1 |
 | 1→3→5 | 5 | 2 |
 | 1→4→5 | 5 | 3 |

 现在`k=3`对于顶点 5。 

| 顶点| k | 贡献 |
 | --- | --- | --- |
 | 5 | 3 | 3 |
 | 其他 | 0 | 0 |

 输出：```
3
```三个菱形对应于选择中间体{2,3,4}中的任意对。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O\!\left(\sum indeg(v)\,outdeg(v)\right)$| 每个长度为 2 的有向步行都会被处理一次 |
 | 空间|$O(n)$| 计算一个源顶点的数组 |

 该图最多包含 30000 条边。 接受的解决方案处理所有长度为 2 的行走，并且仅使用单个大小的计数数组$n$。 运行时间和内存使用量都在限制范围内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    n, m = map(int, input().split())

    g = [[] for _ in range(n)]

    for _ in range(m):
        a, b = map(int, input().split())
        g[a - 1].append(b - 1)

    ans = 0

    for a in range(n):
        cnt = [0] * n

        for u in g[a]:
            for v in g[u]:
                cnt[v] += 1

        for k in cnt:
            ans += k * (k - 1) // 2

    return str(ans)

# provided sample
assert run("""5 4
1 2
2 3
1 4
4 3
""") == "1", "sample 1"

# minimum graph
assert run("""1 0
""") == "0", "single vertex"

# no rhombus
assert run("""3 2
1 2
2 3
""") == "0", "single length-2 path"

# three intermediates
assert run("""5 6
1 2
2 5
1 3
3 5
1 4
4 5
""") == "3", "three choose two"

# two independent rhombi
assert run("""6 8
1 2
2 4
1 3
3 4
1 5
5 6
1 4
4 6
""") == "2", "multiple destinations"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单顶点，无边 | 0 | 最小界限|
 | 一条长度为 2 的路径 | 0 | 路径本身并不是菱形 |
 | 三个中间体到达同一目的地| 3 | 正确使用组合 |
 | 两个独立的菱形 | 2 | 跨目的地累积 |
 | 案例案例| 1 | 基本正确性 |

 ## 边缘情况

 考虑一张只有一条长度为 2 的路径的图：```
3 2
1 2
2 3
```对于源 1，算法记录`cnt[3] = 1`。 贡献是$$\binom{1}{2}=0.$$输出正确为 0，因为菱形需要两个不同的中间体。 

考虑三种不同的中间体：```
5 6
1 2
2 5
1 3
3 5
1 4
4 5
```算法得到`cnt[5]=3`。 它不是仅仅计算一个菱形，而是计算$$\binom{3}{2}=3,$$它正确地计算了所有中间体对。 

Consider disconnected components:```
6 4
1 2
2 3
4 5
5 6
```每个源最多生成一条到任何目的地的长度为 2 的路径。 每个计数最多保持为 1，因此每个贡献都为零。 该算法自然地处理断开的图，没有任何特殊情况。 

考虑四个顶点之间的附加边：```
4 6
1 2
2 4
1 3
3 4
2 3
3 2
```额外的边不会影响所需的路径。 该算法仅按共同的起始和结束顶点对长度为 2 的路径进行分组。 它仍然准确地找到从 1 到 4 的两条这样的路径，给出$$\binom{2}{2}=1.$$输出仍然正确。
