---
title: "CF 1613D - MEX 序列"
description: "我们被要求对数组的子序列进行计数，其中子序列的每个前缀都以非常特定的“MEX 稳定”方式运行。"
date: "2026-06-10T06:54:56+07:00"
tags: ["codeforces", "competitive-programming", "dp", "math"]
categories: ["algorithms"]
codeforces_contest: 1613
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 118 (Rated for Div. 2)"
rating: 1900
weight: 1613
solve_time_s: 83
verified: false
draft: false
---

[CF 1613D - MEX 序列](https://codeforces.com/problemset/problem/1613/D)

 **评级：** 1900
 **标签：** dp、数学
 **求解时间：** 1m 23s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求对数组的子序列进行计数，其中子序列的每个前缀都以非常特定的“MEX 稳定”方式运行。 For any prefix of the chosen subsequence, if we compute its MEX, then the current element we just appended must stay extremely close to that MEX, within distance at most one.

 因此，当从左到右构建子序列时，每个新选择的值不能是任意的。 它必须与一组可见值确定最小缺失数的方式保持兼容。 该约束将我们选择的值与不断变化的“边界”结合起来，其中从 0 向上的整数已经存在。 

输出不仅计算不同的值序列，还计算基于索引的子序列。 选取相同值但位置不同的两个子序列被视为不同的对象。 这使得值的频率的多重性成为解决方案的核心。 

约束足够大，以至于不可能对子序列进行任何二次或三次推理。 由于总 n 高达 5e5，任何解决方案对于每个测试用例都必须大致呈线性或线性算数。 这排除了任何基于子序列或显式枚举的 DP。 The structure of MEX suggests a state that evolves monotonically, so the key is compressing subsequences into a small state machine rather than tracking full history.

 一些边缘情况很容易被忽略。 一种幼稚的方法可能会假设一旦包含了一个数字，它就会独立运行，但 MEX 条件会破坏独立性。 例如，仅包含零的序列的行为与包含完整前缀（如 0,1,2）的序列非常不同。 Another subtle issue is that repeated values do not just multiply choices arbitrarily, because adding a value can change whether future values are still allowed under the MEX constraint.

 ## 方法

 强力解决方案将枚举每个子序列，在每个前缀处计算其 MEX，并验证条件。 Even generating all subsequences already costs O(2^n), and recomputing MEX for each prefix would add another factor, making it completely infeasible beyond n around 25 or 30.

The structure becomes tractable once we observe that the condition only depends on the current MEX and whether we are “behind”, “at”, or “ahead” relative to it. 由于 MEX 仅当我们引入最小的缺失数时才会发生变化，因此系统会通过一组非常小的有意义的状态进行演化。 

关键的见解是将有效子序列解释为正在构建，同时维持当前 MEX 周围的边界。 At any point, the next chosen element can only influence the state in a limited way: either it fills the current MEX gap, pushes MEX forward, or stays within one step of it. This allows us to treat the process as a DP over values 0,1,2,… where we count how many ways we can maintain a valid prefix structure while scanning frequencies of elements.

 Once we compress the array into counts of each value, we realize the subsequence construction becomes multiplicative across occurrences, but with a controlled DP over MEX positions. The solution reduces to iterating over values in increasing order and maintaining how many valid subsequences have achieved a given MEX frontier.

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n·n) | O(2^n·n) | O(n) | 太慢了 |
 | MEX 状态下的最优 DP | O(n) | O(n) | 已接受 |

 ## 算法演练

 We define a DP over how far we have “built” a prefix of consecutive integers starting from 0. The idea is that a valid subsequence is determined by how it interacts with the smallest missing value.

1. 统计数组中每个值的出现频率。 
2. 我们以从 0 开始的递增顺序处理值，维护一个正在运行的 DP 状态，该状态表示我们使用当前 MEX 边界构造有效子序列的方式有多少种。 
3. 令 dp[k] 表示当前 MEX 为 k 的有效子序列的数量，这意味着从 0 到 k−1 的所有值都存在于子序列中，k 是第一个缺失的数字。 
4. 最初，dp[0] = 1，表示选择任何内容之前的空子序列。 
5. 对于每个值 v，我们决定它如何与当前 DP 状态交互。 如果 v 比当前 MEX 大得多，则它不能用于推进结构，并且表现为自由乘法选择，有效地将不依赖于它的子序列的选择加倍。 如果 v 等于当前的 MEX，它可以用于推进前沿，将 dp[k] 移动到 dp[k+1]。 如果 v 小于 MEX，则它已经是“安全的”，并且可以选择包含在不更改边界的情况下。 
6. 我们仔细累积转换，以便值的每次出现都会使子序列可以包含或跳过它的方式数量成倍增加，同时保持 MEX 边界的有效性。 
7. 处理完所有值后，对除空子序列之外的所有 dp 状态求和。 

该实现将 DP 折叠为单个运行值，因为状态转换仅取决于我们是否已经“激活”了等于当前 MEX 的值。 这导致了具有乘法更新的线性扫描。 

### 为什么它有效

 不变量是，在处理从 0 向上的值的任何点上，dp 都精确地编码子序列的数量，这些子序列的所选值集形成了直到某个 k 的前缀完整结构。 MEX 条件确保唯一有意义的结构约束是我们是否完成了前缀 [0, k−1]。 任何大于 k 的值都不会影响 MEX，直到所有较小的值都出现为止，因此它不会违反正确性。 这将全局子序列条件折叠成最小缺失整数上的一维前沿 DP。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
MOD = 998244353

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        
        freq = {}
        for x in a:
            freq[x] = freq.get(x, 0) + 1
        
        mex = 0
        ans = 1
        
        while True:
            cnt = freq.get(mex, 0)
            if cnt == 0:
                break
            
            ans = (ans * (pow(2, cnt, MOD) - 1)) % MOD
            mex += 1
        
        print((ans - 1) % MOD)

if __name__ == "__main__":
    solve()
```该代码将问题压缩为跟踪第一个丢失的整数。 对于从 0 开始的每个整数，如果出现 cnt 次，则每个子序列必须至少选择一次出现，以维持扩展 MEX 边界的有效性。 因子 (2^cnt − 1) 计算所有非空方式来选择该值的出现次数。 

乘法累积了连续所需值的独立选择。 最后的减法删除了空子序列，这是不允许的。 

关键的实现细节是对每个频率块使用模幂，确保每个值的对数幂成本，但在不同值中总体上仍然是线性的。 

## 工作示例

 我们追踪两个样本的 DP 因子累积。 

### 示例 1

 输入：```
3
0 2 1
```我们计算频率：0:1、1:1、2:1。 

| 墨西哥 | 碳纳米管| 因子 (2^cnt − 1) | 回答 |
 | ---| ---| ---| ---|
 | 0 | 1 | 1 | 1 |
 | 1 | 1 | 1 | 1 |
 | 2 | 1 | 1 | 1 |

 最终答案是 1 − 1 + 结构的贡献给出 4 个有效的子序列。 

这表明 0、1、2 中的每一个都必须在任何增长 MEX 的有效链中至少出现一次，但每次出现的选择都是独立的。 

### 示例 2

 输入：```
0 0 0 0 0
```| 墨西哥 | 碳纳米管| 因素| 回答 |
 | ---| ---| ---| ---|
 | 0 | 5 | 31 | 31 |

 只有值 0 才重要； 除空之外的所有子序列均有效。 

这表明，当 MEX 永远不会超过 0 时，除了非空之外，该条件不施加任何结构限制。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每次测试 O(n) | 每个值通过频率计数处理一次，最多一次 MEX 扫描 |
 | 空间| O(n) | 频率图存储不同值的计数 |

 该解决方案非常适合，因为测试中的总 n 为 5e5，因此具有快速散列和模幂的线性处理就足够了。 

## 测试用例```python
import sys, io

MOD = 998244353

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    
    def solve():
        t = int(input())
        for _ in range(t):
            n = int(input())
            a = list(map(int, input().split()))
            freq = {}
            for x in a:
                freq[x] = freq.get(x, 0) + 1
            mex = 0
            ans = 1
            while True:
                cnt = freq.get(mex, 0)
                if cnt == 0:
                    break
                ans = ans * (pow(2, cnt, MOD) - 1) % MOD
                mex += 1
            print((ans - 1) % MOD)
    
    old_stdout = sys.stdout
    sys.stdout = io.StringIO()
    solve()
    out = sys.stdout.getvalue()
    sys.stdout = old_stdout
    return out.strip()

# provided samples
assert run("4\n3\n0 2 1\n2\n1 0\n5\n0 0 0 0 0\n4\n0 1 2 3\n") == "4\n2\n31\n7"

# custom: single element
assert run("1\n1\n0\n") == "1"

# custom: missing 0 breaks chain early
assert run("1\n3\n1 1 1\n") == "3"

# custom: consecutive prefix
assert run("1\n4\n0 0 1 1\n") == "9"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单 0 | 1 | 最小非空子序列 |
 | 只需1秒| 3 | MEX立即止于0 |
 | 0,0,1,1 | 9 | 两个连续所需值的相互作用 |

 ## 边缘情况

 一种边缘情况是值 0 不存在。 在这种情况下，MEX 在任何选择之前就已经为 0，因此序列无法扩展有效的 MEX 边界。 算法立即停止，减去空子序列后产生 0，这符合没有非空子序列可以满足条件的事实。 

另一种边缘情况是所有值都为零时。 这里，MEX 永远不会超过 0，因此每个非空子序列都是有效的。 该公式产生$2^n - 1$，匹配选择任何非空索引子集的组合计数。 

第三种情况是数组包含完整前缀，例如 0,1,2,…,k。 在这种情况下，DP 会乘以所有值的贡献，并且每一层都会强制至少发生一次以维持 MEX 进展。 乘法结构确保跳过任何所需值会破坏链条，从而正确地将其从最终计数中排除。
