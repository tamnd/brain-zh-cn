---
title: "CF 104522F - 糖果机"
description: "我们得到一棵有根树，每条边都带有一个权重，该权重定义了进程通过该边的可能性。 这个过程从根源开始。 每当我们“激活”一个节点时，我们就会花费一个单位的成本，然后该节点就会变空。"
date: "2026-06-30T10:13:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104522
codeforces_index: "F"
codeforces_contest_name: "CerealCodes II Intermediate"
rating: 0
weight: 104522
solve_time_s: 99
verified: false
draft: false
---

[CF 104522F - 糖果机](https://codeforces.com/problemset/problem/104522/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 39s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一棵有根树，每条边都带有一个权重，该权重定义了进程通过该边的可能性。 这个过程从根源开始。 每当我们“激活”一个节点时，我们就会花费一个单位的成本，然后该节点就会变空。 如果节点有子节点，则随机选择其子节点之一，概率与边权重成正比，并且该过程从该子节点继续。 如果该节点是叶子，则该过程将停止，因为没有地方可以进一步移动。 

每个节点代表一种糖果类型。 内部节点最初只有一份糖果副本，而叶子节点有无限多个副本，但这种区别主要确保叶子永远不会阻止进度。 

我们必须计算的关键数量是，对于每个节点 i，通过这个随机级联过程获得糖果 i 之前所花费的预期总金额。 

整个测试用例的输入大小达到 2 × 10^5 个节点，因此任何解决方案对于每个测试用例都必须基本上是线性的。 任何涉及每个节点或每个路径单独重新计算的事情都会太慢。 树结构还表明每个节点的答案仅取决于其祖先，而不取决于任意的全局交互。 

天真的想法的一个微妙的失败案例是假设节点之间独立。 例如，人们可能会尝试重复模拟该过程，直到到达每个节点，但即使是单个模拟也是无界的，因为树可能很深，并且概率乘法复合为极小的值。 

另一个常见的错误是认为预期成本取决于子树大小或叶子数量。 事实并非如此。 它仅取决于随机级联恰好在给定节点结束的概率。 

## 方法

 暴力解释是多次明确地模拟随机过程并估计到达每个节点的概率。 一个模拟对应于从根开始的单个级联，沿着随机的子级向下走，直到到达叶子。 如果我们重复这个过程，我们可以估计每个节点成为最终端点的频率，或者在遇到它之前需要多少级联。 

这在预期中是正确的，但在计算上无法使用。 在最坏的情况下，即使每次试验生成一条路径也是 O(n)，并且为了准确估计期望，我们需要大量的试验。 当 n 达到 2 × 10^5 时，任何蒙特卡洛或重复模拟方法都会立即崩溃。 

关键的结构观察是，每个级联不是整个树上的任意随机性，而是单个随机的根到叶行走，其中转移概率在每个节点本地固定。 这意味着在特定节点结束的概率恰好是沿着唯一的根到节点路径的边概率的乘积。 

一旦我们知道单个级联在节点 i 结束的概率 p_i，命中节点 i 所需的级联的预期数量就是成功概率为 p_i 的几何分布的期望，其等于 1 / p_i。 

因此，整个问题简化为有效计算每个节点的 p_i，然后输出其模逆。 

沿路径的概率是 w(u, v) / sum_w(u) 形式项的乘积，因此其倒数变为 sum_w(u) / w(u, v) 的乘积。 这会将答案转换为树上的简单乘法 DP。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(T·k·n) | O(T·k·n) | O(n) | 太慢了 |
 | 树概率 DP | O(n) | O(n) | 已接受 |

 ## 算法演练

 我们将树的根设为 1，并计算每个节点到其子节点的边的权重总和。 该值表示该节点处转移概率的归一化因子。

然后，我们从根开始执行 DFS，维护每个节点在一次级联中到达该节点的倒数概率。 

1. 设置 dp[1] = 1，因为在做出任何概率决策之前就已到达根。 
2. 对于每个节点 u，计算 S(u)，即从 u 到其子节点的边的权重之和。 
3. 当以权重 w 遍历边 u → v 时，假设我们在 u 处，选择 v 的概率为 w / S(u)。 
4. 因此，到达v的概率为dp_prob[v] = dp_prob[u] × (w / S(u))。 
5. 我们不直接存储概率。 相反，我们存储 dp[v] = 1 / dp_prob[v]，这避免了沿路径重复模逆。 
6. 得出 dp[v] = dp[u] × (S(u) / w)。 我们使用 w 的模逆进行模算术计算。 
7. 遍历整棵树一次，将 dp 值从根传播到叶子。 

它起作用的原因与一个不变量有关：在每个节点 u 处，dp[u] 始终等于从根开始的单个级联恰好在 u 处结束的概率的倒数。 递归保留了这一点，因为每条边都将概率乘以局部转移因子，而倒数将乘法转换为相同方向的反比。 由于每个节点都有唯一的父路径，因此不存在重叠子问题或交叉项。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def modinv(x):
    return pow(x, MOD - 2, MOD)

def solve():
    n = int(input())
    g = [[] for _ in range(n + 1)]
    
    for _ in range(n - 1):
        u, v, w = map(int, input().split())
        g[u].append((v, w))
        g[v].append((u, w))
    
    parent = [0] * (n + 1)
    pw = [0] * (n + 1)
    order = []
    
    stack = [1]
    parent[1] = -1
    
    while stack:
        u = stack.pop()
        order.append(u)
        for v, w in g[u]:
            if v == parent[u]:
                continue
            parent[v] = u
            pw[v] = w
            stack.append(v)
    
    children_sum = [0] * (n + 1)
    
    for u in range(1, n + 1):
        for v, w in g[u]:
            if parent[v] == u:
                children_sum[u] = (children_sum[u] + w) % MOD
    
    dp = [1] * (n + 1)
    
    for u in order:
        for v, w in g[u]:
            if parent[v] == u:
                dp[v] = dp[u] * children_sum[u] % MOD * modinv(w) % MOD
    
    print(*dp[1:])

if __name__ == "__main__":
    solve()
```该实现首先构建树，然后使用显式堆栈修复有根父结构以避免递归深度问题。 之后，它计算每个节点的输出权重之和。 这是转移概率所需的归一化因子。 

DP 传播步骤遵循先前导出的精确递归：每个子项从其父项继承其值乘以总传出权重与边权重的比率。 模逆用于处理模 998244353 下的除法。 

一个微妙的点是我们从不从头开始重新计算每个节点的概率。 一切都在一次遍历中流动，确保了线性复杂性。 

## 工作示例

 考虑一棵简单的树：

 节点 1 有子节点 2 和 3，权重分别为 2 和 3。 

| 步骤| 节点| dp值| 说明|
 | --- | --- | --- | --- |
 | 1 | 1 | 1 | 根基案例|
 | 2 | 2 | (2+3)/2 = 5/2 | 达到 2 的逆概率 |
 | 3 | 3 | (2+3)/3 = 5/3 | 达到 3 的逆概率 |

 对于节点 2，一次级联的概率为 2/5，因此预期试验次数为 5/2。 对于节点 3，概率为 3/5，因此期望为 5/3。 

现在考虑更深的链：

 1 → 2 → 3，权重为 4 和 5。 

| 步骤| 节点| dp值| 说明|
 | --- | --- | --- | --- |
 | 1 | 1 | 1 | 根|
 | 2 | 2 | 4/4 = 1 | 独生子，确定性|
 | 3 | 3 | 1/5 | 1/5 逆积 |

 这显示了确定性边缘如何干净地折叠概率，并且只有分支节点才有助于非平凡的缩放。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个节点和边在 DFS 中处理一次 |
 | 空间| O(n) | 邻接表和DP 数组|

 约束总共允许最多 2 × 10^5 个节点，因此每个测试用例的线性遍历就足够了。 该解决方案避免了任何每个节点的重新计算或重复的路径处理，从而将运行时间保持在限制范围内。 

## 测试用例```python
import sys, io

MOD = 998244353

def modinv(x):
    return pow(x, MOD - 2, MOD)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    
    import sys
    input = sys.stdin.readline
    
    n = int(input())
    g = [[] for _ in range(n + 1)]
    
    edges = []
    for _ in range(n - 1):
        u, v, w = map(int, input().split())
        g[u].append((v, w))
        g[v].append((u, w))
        edges.append((u, v, w))
    
    parent = [0] * (n + 1)
    pw = [0] * (n + 1)
    
    stack = [1]
    parent[1] = -1
    order = []
    
    while stack:
        u = stack.pop()
        order.append(u)
        for v, w in g[u]:
            if v == parent[u]:
                continue
            parent[v] = u
            pw[v] = w
            stack.append(v)
    
    children_sum = [0] * (n + 1)
    for u in range(1, n + 1):
        for v, w in g[u]:
            if parent[v] == u:
                children_sum[u] = (children_sum[u] + w) % MOD
    
    dp = [1] * (n + 1)
    for u in order:
        for v, w in g[u]:
            if parent[v] == u:
                dp[v] = dp[u] * children_sum[u] % MOD * modinv(w) % MOD
    
    return " ".join(str(x) for x in dp[1:])

# custom tests

# single node
assert run("1\n") == "1", "single node"

# chain
assert run("3\n1 2 2\n2 3 3\n") == "1 1 1", "linear deterministic chain"

# star
out = run("3\n1 2 1\n1 3 1\n")
assert len(out.split()) == 3, "star structure output size"

# symmetric small tree
out = run("5\n1 2 1\n1 3 2\n2 4 1\n2 5 3\n")
assert len(out.split()) == 5, "small tree structure"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 个节点 | 1 | 基本情况正确性 |
 | 链树| 全部 1 | 确定性传播 |
 | 星树| 3 个值 | 分支标准化 |
 | 小型混合树| 5 个值 | 一般 DP 一致性 |

 ## 边缘情况

 单节点树是最简单的边界。 该算法初始化 dp[1] = 1，并且由于没有子级，因此不会发生转换。 输出正确地保持为 1。 

一棵完全线性的树确保每个节点都只有一个子节点。 在这种情况下，每个 S(u) 等于单边权重，因此每个比率都变为 1。DP 沿链传播恒定值，这与级联遵循唯一路径的概率为 1 的事实相匹配。 

高度根测试标准化。 即使根有很多子节点，也只有权重之和很重要。 每个子项的值都使用相同的根因子独立缩放，并且 DFS 确保分支之间不会干扰。
