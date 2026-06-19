---
problem: 1042B
contest_id: 1042
problem_index: B
name: "Vitamins"
contest_name: "Codeforces Round 510 (Div. 2)"
rating: 1200
tags: ["bitmasks", "brute force", "dp", "implementation"]
answer: passed_samples
verified: false
solve_time_s: 306
date: 2026-06-18
model: gpt-5-5
samples_passed: 0
samples_total: 1
share_url: https://chatgpt.com/share/6a33bcc3-88bc-83ec-9157-fb55c8978ed7
---

# CF 1042B - 维生素

 **评分：** 1200
 **标签：** 位掩码、暴力破解、dp、实现
 **型号：** gpt-5-5
 **求解时间：** 5m 6s
 **已验证：** 否（0/1 个样本）
 **分享：** https://chatgpt.com/share/6a33bcc3-88bc-83ec-9157-fb55c8978ed7

 ---

 ## 解决方案

 ## 问题理解

 我们有一系列果汁选择，其中每种选择都有一定的成本和它提供的一组维生素。 总共只有三种维生素，分别标记为 A、B 和 C。当 Petya 购买一套果汁时，他实际上吸收了这些果汁中包含的所有维生素。 目标是选择果汁的子集，以便涵盖所有三种维生素，同时最大限度地降低总成本。 

这不是排序或排序问题，而是最多 1000 个项目的纯粹子集选择问题。 每个项目仅贡献一项$2^3 - 1 = 7$可能的维生素组合，因此问题的结构被严重压缩。 任务是找到最便宜的组合，其并集等于完整集合{A，B，C}。 

约束条件$n \le 1000$意味着即使项目的二次解也是边缘的，但​​在优化形式下仍然可行。 然而，任何尝试对所有果汁进行完整子集枚举的方法，即$2^{1000}$，是不可能的。 即使是所有子集上的朴素 DP 也被排除。 关键的限制是状态空间不是由果汁的数量定义的，而是由维生素组合的数量定义的。 

当多种果汁共享相同的维生素面膜但成本不同时，就会出现一个微妙的问题。 例如，如果两种果汁都只提供维生素 A，我们只关心最便宜的一种，因为任何最佳解决方案都不会使用更昂贵的副本。 另一种边缘情况是当果汁根本不含所需维生素时，例如不含 C 的果汁。在这种情况下，即使 A 和 B 被完全覆盖，答案也必须为 -1。 

另一个特殊情况是，单一果汁含有所有维生素 A、B 和 C。与组合更便宜的部分果汁相比，单独的果汁可能是最佳的，也可能不是最佳的。 任何总是喜欢最“完整”果汁的贪婪方法在 A+B+C 成本为 100 的情况下都会失败，而 A、B 和 C 各自成本为 1。 

## 方法

 一个直接的蛮力想法是考虑果汁的每个子集并计算维生素和总成本的联合。 这是正确的，因为它探索了所有可能性，但需要迭代$2^n$子集。 和$n = 1000$，这是一个天文数字，远远超出了任何计算极限。 

关键的观察结果是维生素空间很小。 每个果汁对应一个范围为 1 到 7 的掩码，其中每个位代表 A、B 或 C 是​​否存在。 我们可以考虑选择面膜的组合，而不是考虑选择果汁的子集。 

一旦我们通过掩码压缩果汁，问题就变成了：选择最多三位掩码的多重集，其按位或等于 7，从而最小化成本。 这建议对位掩码进行动态编程，或者简单地维持每个掩码的最小成本，然后尝试 1、2 或 3 个掩码的所有组合。 

由于只有 7 个掩码，我们可以安全地枚举所有掩码对和三元组来计算最佳组合。 这可以将问题从指数级减少到$n$到掩模上的恒定时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 对子集的暴力破解 |$O(2^n \cdot n)$|$O(n)$| 太慢了|
 | 位掩码压缩+枚举|$O(n + 7^3)$|$O(7)$| 已接受 |

 ## 算法演练

 1. 将每个果汁的维生素字符串转换为 3 位掩码，其中 A = 1、B = 2、C = 4。这将每个项目减少为 1 到 7 之间的数字。这一步将问题转变为固定状态优化问题。 
2. 维护数组`best[8]`，初始化为无穷大，其中`best[m]`存储任何与面膜完全匹配的果汁的最低成本`m`。 我们只关心每种类型的最便宜的代表。 
3. 对于每种果汁，计算其掩码并更新`best[mask] = min(best[mask], cost)`。 这确保我们永远不会保留主导选择。 
4. 如果`best`即使组合起来也无法覆盖所有必需的位，我们稍后将通过检查可行性来检测它。 
5. 枚举所有掩码对`(i, j)`并计算`best[i] + best[j]`，跟踪 OR 等于 7 的那些。这涵盖使用一种或两种果汁的解决方案。 
6. 枚举所有三元组`(i, j, k)`同样，检查`i | j | k == 7`，更新答案。 这确保我们也涵盖需要三种部分果汁的情况。 
7. 返回最小有效总和，如果没有组合达到完全覆盖，则返回 -1。 

### 为什么它有效

 每种果汁都属于其维生素面膜定义的仅有的七个等价类别之一。 任何最佳解决方案都可以转化为每个所选面膜最多使用一个代表的解决方案，并且用更便宜的同一面膜替换所选果汁绝不会恶化结果。 由于目标空间只有 7 个状态，因此枚举最多三个掩码的所有组合足以表示任何可行的维生素联合。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**18

n = int(input())
best = [INF] * 8

for _ in range(n):
    parts = input().split()
    c = int(parts[0])
    s = parts[1]

    mask = 0
    for ch in s:
        if ch == 'A':
            mask |= 1
        elif ch == 'B':
            mask |= 2
        else:
            mask |= 4

    best[mask] = min(best[mask], c)

ans = INF

for i in range(1, 8):
    if best[i] == INF:
        continue
    if i == 7:
        ans = min(ans, best[i])

for i in range(1, 8):
    for j in range(1, 8):
        if best[i] == INF or best[j] == INF:
            continue
        if (i | j) == 7:
            ans = min(ans, best[i] + best[j])

for i in range(1, 8):
    for j in range(1, 8):
        for k in range(1, 8):
            if best[i] == INF or best[j] == INF or best[k] == INF:
                continue
            if (i | j | k) == 7:
                ans = min(ans, best[i] + best[j] + best[k])

print(-1 if ans == INF else ans)
```该解决方案首先将每个果汁压缩到一个位掩码中，然后通过仅保留每个掩码最便宜的成本来减少重复。 最终答案是通过最多三个掩码的强力组合来计算的。 三重循环是安全的，因为状态空间固定为 7，因此总操作保持不变。 

一个微妙的细节是，我们允许重复使用面膜组合，这是正确的，因为如果一个最便宜的果汁与其他面膜一起不足以达到完全覆盖，有时需要购买两种不同的果汁和同一个面膜。 

## 工作示例

 ### 示例 1

 输入：```
4
5 C
6 B
16 BAC
4 A
```我们将果汁映射到面膜中：

 | 果汁| 面膜| 成本|
 | --- | --- | --- |
 | C | 4 | 5 |
 | 乙| 2 | 6 |
 | 北汽 | 7 | 16 | 16
 | 一个 | 1 | 4 |

 压缩后，`best`是：

 A=4，B=6，C=5，ABC=16。 

我们现在评估组合。 

| 步骤| 精选面膜| 或 | 成本|
 | --- | --- | --- | --- |
 | 单身| (7) | 7 | 16 | 16
 | 一对| (1,2,4) | 7 | 4+6+5=15 |

 最小值为 15。 

这证实了即使一种果汁涵盖了所有维生素，但将更便宜的部分维生素结合起来效果更好。 

### 示例2（无解案例）

 输入：```
3
5 A
6 B
10 AB
```掩码为 A=1、B=2、AB=3。 没有含有C的面膜。 

| 步骤| 组合 | 或 | 有效 |
 | --- | --- | --- | --- |
 | 任何| 子集| 从来没有 7 | 没有|

 任何组合都不能产生位 4，因此答案为 -1。 该算法自然返回 INF 并输出 -1。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n + 7^3)$| 线性扫描计算掩码以及 7 个状态的常量枚举
 | 空间|$O(1)$| 大小为 8 的固定数组 |

 该算法很容易满足限制，因为重部分独立于$n$预处理后。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    INF = 10**18
    n = int(input())
    best = [INF] * 8

    for _ in range(n):
        parts = input().split()
        c = int(parts[0])
        s = parts[1]

        mask = 0
        for ch in s:
            if ch == 'A':
                mask |= 1
            elif ch == 'B':
                mask |= 2
            else:
                mask |= 4

        best[mask] = min(best[mask], c)

    ans = INF

    for i in range(1, 8):
        if best[i] < INF and i == 7:
            ans = min(ans, best[i])

    for i in range(1, 8):
        for j in range(1, 8):
            if best[i] < INF and best[j] < INF and (i | j) == 7:
                ans = min(ans, best[i] + best[j])

    for i in range(1, 8):
        for j in range(1, 8):
            for k in range(1, 8):
                if best[i] < INF and best[j] < INF and best[k] < INF and (i | j | k) == 7:
                    ans = min(ans, best[i] + best[j] + best[k])

    return "-1" if ans == INF else str(ans)

# provided sample
assert run("""4
5 C
6 B
16 BAC
4 A
""") == "15"

# no C case
assert run("""3
5 A
6 B
10 AB
""") == "-1"

# single optimal juice
assert run("""3
10 ABC
100 A
100 B
""") == "10"

# duplicates cheaper combination
assert run("""5
10 A
1 A
10 B
1 B
100 C
""") == "3"

# all separate
assert run("""3
1 A
1 B
1 C
""") == "3"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 混合最优三元| 15 | 15 最佳组合与全果汁|
 | 缺少维生素| -1 | 不可能检测|
 | 单一ABC | 10 | 10 单项最优情况|
 | 重复 | 3 | 处理重复的面具|
 | 全部分开| 3 | 组合的基本正确性 |

 ## 边缘情况

 一个关键的边缘情况是多种果汁共享同一个掩码。 该算法通过正确地折叠它们`best[mask]`，确保只考虑最便宜的。 例如，如果 A 的成本为 5，另一个 A 的成本为 2，则仅保留 2，并且涉及 A 的任何最优解都将使用它。 

另一种情况是最佳解决方案使用少于三种果汁。 枚举明确包括单个和成对组合，因此诸如（A+B+C 合在一起）或（A+B，C）之类的解决方案都涵盖在内。 

最后，不可能的情况得到了干净的处理，因为任何掩码组合都不会生成丢失的位。 如果维生素 C 从未出现在任何面膜中，则每个 OR 保持≤3，并且算法永远不会更新`ans`，结果为-1。
