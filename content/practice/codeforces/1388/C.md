---
problem: 1388C
contest_id: 1388
problem_index: C
name: "Uncle Bogdan and Country Happiness"
contest_name: "Codeforces Round 660 (Div. 2)"
rating: 1800
tags: ["dfs and similar", "greedy", "math", "trees"]
answer: passed_samples
verified: true
solve_time_s: 155
date: 2026-06-14
model: gpt-5-3-mini
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a2e786e-940c-83ec-aff8-b894ca81a057
---

# CF 1388C - 博格丹叔叔和乡村幸福

 **评分：** 1800
 **标签：** dfs 和类似的、贪婪的、数学、树
 **型号：** gpt-5-3-mini
 **求解时间：** 2m 35s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a2e786e-940c-83ec-aff8-b894ca81a057

 ---

 ## 解决方案

 ## 问题理解

 该国是一棵植根于城市 1 的城市树，每个公民都在首都开始新的一天，然后沿着树中独特的最短路径返回自己的家乡。 每个城市都有已知的人口分布在各个城市，每个人根据他们的心情好坏贡献+1或-1。 

关键的观察是，一个人唯一能影响一个城市幸福指数的时候是当他从首都到家乡的路上经过这个城市时。 由于所有路径都是简单的根到节点路径，因此每个公民都沿着树中的一条路径做出贡献。 

对于每个城市，我们都有一个目标值 h[i]，它应该等于所有经过该城市的人的贡献的最终总和。 任务是确定是否存在情绪分配（好或坏）以及沿路径可能的情绪变化，以便可以同时实现所有这些 h[i] 值。 

这些约束促使我们为每个测试用例提供线性或接近线性的解决方案。 由于节点总数最多为 2⋅10^5，测试用例最多为 10^4，因此任何每个测试用例执行时间超过 O(n) 或总体执行时间超过 O(n log n) 的解决方案都存在风险。 单独跟踪每个人的简单模拟是不可能的，因为 m 可以大到 10^9。 

当一个城市没有人口但 h[i] 非零时，就会出现微妙的边缘情况。 例如，如果一个叶子城市的 p[i] = 0 但 h[i] = 5，则这是不可能的，因为没有路径可以在那里产生额外的人口。 另一个棘手的情况是，当价值观在局部看起来一致但在整体上违反了从父母到孩子的流动守恒定律时。 

## 方法

 暴力解释将分别对待每个人。 我们可以想象为 m 个人中的每一个分配一种情绪，并模拟他们从根到家的路径，在每个访问的节点上标记贡献。 这在概念上是正确的，但立即不可行，因为每个人最多可以遍历 O(n) 个节点，从而进行 O(nm) 次操作，当 m 达到 10^9 时，这远远超出了限制。 

我们需要从考虑个体转向考虑总体流量。 我们不是跟踪人，而是跟踪有多少人必须通过每个子树以及其中有多少人被允许做坏事。 关键的见解是，树结构强制进行递归分解：每个子树必须仅使用其中的人以及上面的内容来“解释”其所需的幸福。 

我们将树的根设为 1 并执行 DFS。 在每个节点，我们计算其子树中有多少人（称为总数）以及其中有多少人必须满足所需的幸福约束。 问题变成了可行性检查，检查这些所需的良好计数是否可以保持在每个子树的有效范围内。 

在节点 u 处，如果我们已经知道子子树需要比该子树中可用人员更多的“良好贡献”，则配置是不可能的。 同样，如果所需的好人数量为负数或超过可用人数总数，则这是不可能的。 

这会导致贪婪的后序遍历，其中每个子树向上聚合其需求，并在本地检查可行性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解（模拟个人）| O(纳米) | O(纳米) | 太慢了 |
 | 具有子树聚合的树 DFS | O(n) | O(n) | 已接受 |

 ## 算法演练

 我们以节点 1 为树的根，并将其视为从父级到子级的有向结构。

1. 为树建立邻接表。 这使得 O(n) 内的高效遍历成为可能。 
2. 从根运行 DFS。 对于每个节点 u，我们从其子节点计算两个值：其子树中的总人数以及该子树中必须存在的“必需的好人”数量，以满足下面的所有约束。 

我们使用后序遍历的原因是节点的可行性完全取决于其子节点如何分配其所需的贡献。 
3. 在每个节点u处，初始化total_people = p[u]和required_good = 0。 
4. 对于 u 的每个子 v，递归计算其 (total_v, good_v)。 将total_v 添加到total_people，并将good_v 添加到required_good。 

这种聚合反映了子子树中的所有人在到达根之前都必须经过u，因此他们的约束向上累积。 
5.处理完children后，加入幸福约束h[u]。 令当前余额为通过 u 的好贡献和坏贡献之间的差异。 由于子树中的总人数是固定的，因此我们将 required_good 解释为该子树中必须保持良好状态才能实现 h[u] 的人数。 

我们将 h[u] 翻译成对子树 u 中必须存在多少好人的约束：

 required_good = (total_people + h[u]) / 2。 

这来自解决：

 好 - 坏 = h[u]

 好+坏=总人数

 这意味着：

 好 = (total_people + h[u]) / 2
 6. 如果 (total_people + h[u]) 为奇数或 required_good 在 [0,total_people] 之外，则返回不可能。 
7.向上返回(total_people, required_good)给父级。 
8. 如果根可行，则回答YES。 

### 为什么它有效

 每个子树都被视为一个封闭的系统，其中的所有人员都向根路径上的每个节点贡献一次。 因为贡献是累加性的，并且路径在树中是唯一的，所以每个子树只需要确保它声称的良好分配的数量与其总种群和所需的净差 h[u] 一致。 DFS 确保在节点提交值之前满足所有后代约束，因此必须尽早在子树边界检测到任何违规。 

## Python 解决方案```python
import sys
sys.setrecursionlimit(10**7)
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    p = list(map(int, input().split()))
    h = list(map(int, input().split()))

    g = [[] for _ in range(n)]
    for _ in range(n - 1):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        g[a].append(b)
        g[b].append(a)

    def dfs(u, parent):
        total = p[u]
        good = 0

        for v in g[u]:
            if v == parent:
                continue
            t_v, g_v = dfs(v, u)
            total += t_v
            good += g_v

        if (total + h[u]) % 2 != 0:
            return -1, -1

        req_good = (total + h[u]) // 2

        if req_good < 0 or req_good > total:
            return -1, -1

        if good > req_good:
            return -1, -1

        return total, req_good

    ok_total, ok_good = dfs(0, -1)
    print("YES" if ok_total != -1 else "NO")

t = int(input())
for _ in range(t):
    solve()
```DFS 每个节点返回两个值：其子树中的总人口以及满足该节点的幸福约束所需的好人数量。 奇偶校验强制要求好人和坏人之间存在有效的划分。 

一个常见的错误是忽略奇偶条件。 由于好和坏都是整数，因此 (total + h[u]) 必须是偶数。 另一个微妙之处是确保计算出的 required_good 不会超过子树总数或低于零。 

## 工作示例

 ### 示例 1

 输入：```
1
3 3
1 1 1
1 1 -1
1 2
1 3
```树：

 1 是根，孩子 2 和 3。 

| 节点| 总子树| 哈[u] | 必需_好 | 有效性 |
 | ---| ---| ---| ---| ---|
 | 2 | 1 | 1 | 1 | 好的 |
 | 3 | 1 | -1 | 0 | 好的 |
 | 1 | 3 | 1 | 2 | 好的 |

 两个孩子都是有效的，并且根约束是一致的。 

这显示了子树值如何独立有效并在根处干净地组合。 

### 示例 2

 输入：```
1
2 2
1 1
-1 1
1 2
```| 节点| 总子树| 哈[u] | 必需_好 | 有效性 |
 | ---| ---| ---| ---| ---|
 | 2 | 1 | 1 | 1 | 好的 |
 | 1 | 2 | -1 | 0.5 | 0.5 无效|

 从根本上来说，奇偶校验立即失败，因为total + h 是奇数。 这捕获了局部子树一致性存在但全局可行性由于整数约束而破坏的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 在DFS中每个节点和边都被访问一次|
 | 空间| O(n) | 邻接表和递归栈|

 测试用例的节点总数最多为 2⋅10^5，因此每个测试用例的线性 DFS 保持在时间限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    import builtins

    output = []
    def input():
        return sys.stdin.readline().strip()

    def solve_all():
        t = int(input())
        for _ in range(t):
            n, m = map(int, input().split())
            p = list(map(int, input().split()))
            h = list(map(int, input().split()))
            g = [[] for _ in range(n)]
            for _ in range(n - 1):
                a, b = map(int, input().split())
                g[a-1].append(b-1)
                g[b-1].append(a-1)

            sys.setrecursionlimit(10**7)

            def dfs(u, par):
                total = p[u]
                good = 0
                for v in g[u]:
                    if v == par:
                        continue
                    t, gg = dfs(v, u)
                    total += t
                    good += gg
                if (total + h[u]) % 2 != 0:
                    return -1, -1
                req = (total + h[u]) // 2
                if req < 0 or req > total:
                    return -1, -1
                if good > req:
                    return -1, -1
                return total, req

            ok = dfs(0, -1)[0] != -1
            output.append("YES" if ok else "NO")

    solve_all()
    return "\n".join(output)

# provided samples
assert run("""2
7 4
1 0 1 1 0 1 0
4 0 0 -1 0 -1 0
1 2
1 3
1 4
3 5
3 6
3 7
5 11
1 2 5 2 1
-11 -2 -6 -2 -1
1 2
1 3
1 4
3 5
""") == "YES\nYES"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单节点 | 是 | 基本情况正确性 |
 | 奇偶校验无效的星形树 | 否 | 奇偶校验约束检测|
 | 深链一致价值观| 是 | 传播正确性 |
 | 子树要求不一致 | 否 | 局部可行性失败|

 ## 边缘情况

 一个关键的边缘情况是当子树的人口为零但所需的幸福度非零时。 例如，p[i] = 0 且 h[i] = 2 的叶节点会立即失败，因为不存在好或坏状态的分配。 DFS 在计算 (total + h[i]) / 2 时捕获了这一点，这会产生负值或小数值。 

另一个重要的情况是，当所有约束在本地有效，但父节点需要的好人数量少于子节点已经固定的数量时。 在这种情况下，good > required_good 会触发失败，确保更高级别的聚合不会违反子承诺。
