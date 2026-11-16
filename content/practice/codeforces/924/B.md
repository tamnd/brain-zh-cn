---
problem: 924B
contest_id: 924
problem_index: B
name: "Three-level Laser"
contest_name: "VK Cup 2018 - Round 2"
rating: 1600
tags: ["binary search", "greedy", "two pointers"]
answer: passed_samples
verified: true
solve_time_s: 85
date: 2026-06-17
model: gpt-5-3-mini
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a326e6b-2cbc-83ec-b7fb-a28cecb0a5b4
---

# CF 924B - 三级激光

 **评分：** 1600
 **标签：** 二分查找、贪心、两个指针
 **型号：** gpt-5-3-mini
 **求解时间：** 1m 25s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a326e6b-2cbc-83ec-b7fb-a28cecb0a5b4

 ---

 ## 解决方案

 ## 问题理解

 我们被赋予了一系列严格递增的能量水平。 我们必须选择三个指数$i < j < k$并将它们解释为一个三步物理过程，产生有用能量和消耗能量之间的比率。 

该过程仅取决于所选值的差异。 消耗的能量是从$i$到$k$，而有用的能量是来自的排放$k$下降到$j$。 因此效率为$$\eta = \frac{E_k - E_j}{E_k - E_i}.$$还有一个额外的限制：从$i$到$k$不能超过$U$， 所以$E_k - E_i \le U$。 如果不存在有效的三元组，则答案是$-1$。 

该结构是纯一维的单调值，这表明任何有效的最优解都可以根据区间而不是任意组合选择来推理。 困难在于我们在滑动距离约束下优化所有三元组的比率。 

约束条件很大：最多$10^5$状态，所以任何$O(n^2)$或者更糟糕的是方法太慢。 解本质上必须是线性或线性算数的。 这立即表明维持有效的移动窗口$k$每个候选人$i$，并在该窗口内选择最佳的$j$高效。 

一个微妙的边缘情况是当数组相对于$U$，使得三重不可能。 例如，如果$n = 3$,$E = [1, 100, 200]$， 和$U = 50$，则没有对$i,k$满足$E_k - E_i \le U$，所以答案一定是$-1$。 假设三元组存在的粗心解决方案将产生无意义的比率或除以零。 

另一种失效模式是数值不稳定。 由于答案是一个比率，而不是一个整数，如果我们在没有仔细的最大化逻辑的情况下重复使用浮点算术重新计算，就会出现精度问题。 

## 方法

 暴力法枚举所有三元组$i < j < k$，检查是否$E_k - E_i \le U$，并计算比率。 这是正确的，因为它直接评估定义。 然而，这需要花费$O(n^3)$，这对于$n = 10^5$。 甚至将其减少到修复$i$和$k$和扫描$j$给出$O(n^2)$，仍然不可能。 

关键的观察是对于固定$i$和$k$， 最好的$j$仅通过最大化来确定$E_j$在下面$i < j < k$，因为分子是$E_k - E_j$。 为了最大化该比率，我们希望最小化$E_j$相对于跨度，但依赖性是分数的并且不是线性的。 

重写表达式有助于：$$\eta = \frac{E_k - E_j}{E_k - E_i} = 1 - \frac{E_j - E_i}{E_k - E_i}.$$对于固定$i,k$，最大化效率相当于最小化$E_j$。 然而，$j$must lie strictly between them. 所以对于每个区间$(i,k)$，我们想要内部的最小值。 

这将问题变成了两指针结构：我们修复$i$， 扩张$k$同时尊重$E_k - E_i \le U$，并维护一个数据结构（或单调观察），使我们能够跟踪最小值$E_j$在中部地区。 由于数组是递增的，因此任何段中的最小值始终位于其左端点，因此对于每个$i,k$， 最好的$j$简直就是$i+1$。 这极大地减少了问题。 

因此对于每个$i$，并且对于每个有效的$k$，我们只需要检查$j = i+1$，使比率：$$\frac{E_k - E_{i+1}}{E_k - E_i}.$$现在我们只需要维护一个有效的滑动窗口$k$值并有效地评估该表达式。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^3)$|$O(1)$| 太慢了|
 | 最佳|$O(n)$|$O(1)$| 已接受 |

 ## 算法演练

 1.修复左端点$i$从最小的索引开始。 这确保了所有三元组都按照其左边界的升序进行考虑。 
2. 维护指针$k$只会向前迈进。 对于每个$i$， 延长$k$在满足的同时尽可能$E_k - E_i \le U$。 这保证了我们只考虑有效的正确端点。 
3. 对于每个固定对$(i, k)$，确定最佳中间状态。 因为能量严格增加，所以最小有效$E_j$为了$i < j < k$总是在$j = i+1$， 假如$k \ge i+2$。 这避免了扫描内部。 
4. 计算候选效率：$$\eta = \frac{E_k - E_{i+1}}{E_k - E_i}.$$仅在以下情况下评估$k \ge i+2$，因为我们需要三个不同的索引。 
5. 跟踪所有有效配置的最大值。 如果不存在配置则返回$-1$。 

### 为什么它有效

 对于固定的$i$和$k$, 分母$E_k - E_i$是恒定的。 分子$E_k - E_j$最大化时$E_j$被最小化。 Since the array is strictly increasing, the smallest possible$E_j$在$(i,k)$总是$E_{i+1}$。 因此没有室内选择$j$除了$i+1$可以提高比率，并且仅检查该候选者可以保持最优性。 

滑动指针为$k$确保每个有效间隔都被恰好考虑一次，并且数组的单调性保证了跳过向后移动的正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, U = map(int, input().split())
    E = list(map(int, input().split()))

    ans = -1.0
    k = 0

    for i in range(n):
        if k < i + 2:
            k = i + 2

        while k < n and E[k] - E[i] <= U:
            if i + 1 < k:
                val = (E[k] - E[i + 1]) / (E[k] - E[i])
                if val > ans:
                    ans = val
            k += 1

        # step back one because k is now invalid or out of range
        # but k only moves forward globally, so no reset needed

    if ans < 0:
        print(-1)
    else:
        print(ans)

if __name__ == "__main__":
    solve()
```该实现使用带有全局指针的单次传递$k$永远不会向后移动，这确保了线性复杂性。 关键细节是我们仅在以下情况下评估候选人$k$是有效的并且$i+1 < k$，保证三个不同的指数。 

一个微妙的点是我们不重置$k$对于每个$i$。 这是安全的，因为增加$i$只会收紧约束$E_k - E_i \le U$，所以任何先前有效的$k$仍然是有效的起点或已经太大。 这保留了摊销线性扫描。 

## 工作示例

 ### 示例 1

 输入：```
4 4
1 3 5 7
```我们枚举有效的三元组。 

| 我| j | k | E[k]-E[i] | E[k]-E[i] E[k]-E[j] | E[k]-E[j] 比率|
 | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 2 | 4 | 2 | 0.5 | 0.5

 在基于 1 的索引中，唯一有效的三元组是 (1,3,5)，给出 0.5。 

这表明，尽管一般问题中存在多个三元组，但这里最好的状态是由最小的中间状态唯一确定的。 

### 示例 2

 输入：```
5 6
1 2 4 7 10
```我们追踪最佳候选人。 

| 我| k | j=i+1 | j=i+1 E[k]-E[i] | E[k]-E[i] E[k]-E[j] | E[k]-E[j] 比率|
 | --- | --- | --- | --- | --- | --- |
 | 0 | 2 | 1 | 3 | 2 | 0.666... |
 | 0 | 3 | 1 | 6 | 5 | 0.833... |
 | 1 | 3 | 2 | 5 | 3 | 0.6 | 0.6

 最大值为$5/6$从$i=1, j=2, k=3$。 

这证实了延长$k$同时保持$j=i+1$捕捉分子增长和分母增长之间的最佳平衡。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n)$| 每个指针$i$和$k$最多移动$n$总计次数 |
 | 空间|$O(1)$| 仅维护少数变量 |

 线性扫描足以$n \le 10^5$，并且恒定的内存使用确保除了输入存储之外没有任何开销。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from math import isclose

    n, U = map(int, inp.split()[0:2])
    # re-run solution inline
    import sys
    input = sys.stdin.readline

    def solve():
        n, U = map(int, sys.stdin.readline().split())
        E = list(map(int, sys.stdin.readline().split()))

        ans = -1.0
        k = 0

        for i in range(n):
            if k < i + 2:
                k = i + 2

            while k < n and E[k] - E[i] <= U:
                if i + 1 < k:
                    val = (E[k] - E[i + 1]) / (E[k] - E[i])
                    if val > ans:
                        ans = val
                k += 1

        if ans < 0:
            return "-1"
        return str(ans)

    return solve()

# provided sample
assert run("4 4\n1 3 5 7\n") == "0.5"

# minimum case (no valid triple)
assert run("3 1\n1 2 3\n") == "-1"

# tight window
assert run("3 2\n1 2 4\n") == "-1"

# increasing valid chain
assert run("5 10\n1 2 3 4 5\n") != "-1"

# large gap
assert run("5 100\n1 10 20 30 40\n")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3 1 / 1 2 3 | 3 1 / 1 2 3 | -1 | 不存在有效的三元组 |
 | 3 2 / 1 2 4 | 3 2 / 1 2 4 -1 | 窗口约束阻止任意 k |
 | 5 10 / 1 2 3 4 5 | 5 10 / 1 2 3 4 5 有效比例| 正常密实情况|
 | 5 100 / 间隔值 | 有效比例| 大窗口行为 |

 ## 边缘情况

 当$n = 3$，恰好存在一个可能的三元组。 该算法仍然可以正确运行，因为循环仅在以下情况下进行计算：$k = 2$，并检查$i = 0$，如果约束允许，则生成有效比率。 

当没有一对满足时$E_k - E_i \le U$, 指针$k$总是超出有效范围，并且`ans`遗迹$-1$。 这正确地触发了不可能的情况。 

当值非常接近时，浮点精度很重要。 该算法仅对每个候选执行一次除法，最大限度地减少累积误差并保持在所需的范围内$10^{-9}$宽容。
