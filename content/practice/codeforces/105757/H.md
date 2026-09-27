---
title: "CF 105757H - 克莱因·莫雷蒂之谜"
description: "给定一个长度为 n 的数组和一个固定大小的子序列 k。 对于每个查询值 x，我们必须计算有多少个正好包含 k 个元素的子序列按位或等于 x。"
date: "2026-06-25T23:22:56+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105757
codeforces_index: "H"
codeforces_contest_name: "Insomnia 2025"
rating: 0
weight: 105757
solve_time_s: 50
verified: true
draft: false
---

[CF 105757H - 克莱因·莫雷蒂之谜](https://codeforces.com/problemset/problem/105757/H)

 **评级：** -
 **标签：** -
 **求解时间：** 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个长度的数组`n`和固定的子序列大小`k`。 对于每个查询值`x`，我们必须计算有多少个子序列恰好包含`k`元素按位或等于`x`。 

这里的子序列是由所选择的位置决定的，因此如果相同的值出现多次，则不同的出现次数将被单独计数。 

限制是主要挑战。 两个都`n`查询次数可以达到100万个，每个数组值以及每个查询值最多为100万个。 自从`10^6 < 2^20`，每个值都适合 20 位。 独立处理每个查询的解决方案立即被排除。 甚至一个`O(q log n)`当方法太昂贵时`q = 10^6`。 唯一现实的方向是为每个可能的 20 位掩码预处理一次答案，然后在恒定时间内回答每个查询。 

一个常见的错误是直接考虑子序列的 OR 值。 可能的子序列的数量是巨大的。 

考虑：```
n = 3, k = 2
a = [1, 2, 4]
```子序列是：```
{1,2} -> 3
{1,4} -> 5
{2,4} -> 6
```尝试显式生成 OR 值显然无法扩展。 

当多个值相同时会出现另一种微妙的情况：```
n = 4, k = 2
a = [1,1,1,1]
```或总是`1`，但答案不是`1`。 这是：```
C(4,2) = 6
```我们计算位置选择，而不是不同的价值集。 

当查询掩码包含从未出现在任何选定元素中的位时，会出现第三种边缘情况：```
n = 3, k = 2
a = [1,2,2]
query = 7
```没有子序列可以产生位`4`，所以答案是`0`。 任何仅跟踪查询掩码子集而不考虑实际频率的方法都可能错误地产生非零结果。 

## 方法

 蛮力的想法很简单。 枚举每个大小的子序列`k`，计算其 OR，并计算每个 OR 值出现的次数。 

这是正确的，因为每个有效子序列都被检查一次。 

问题是子序列的数量：```
C(n,k)
```即使对于中等值`n`，这变得天文数字般大。 和`n`达到一百万，暴力破解是完全不可能的。 

关键的观察来自于颠倒问题。 

而不是问：```
How many subsequences have OR exactly x?
```问：```
How many subsequences have OR contained inside x?
```子序列内部包含 OR`x`如果每个选定的元素仅使用已存在于`x`。 

对于面膜来说`x`， 让：```
g[x] = number of array elements whose bit set is a subset of x
```每个尺寸-`k`从这些中选择的子序列`g[x]`元素最多有 OR`x`。 

因此：```
F[x] = C(g[x], k)
```计算 OR 是以下子集的子序列`x`。 

现在让：```
ans[x] = number of subsequences whose OR equals x
```每个子序列都计入`F[x]`恰好贡献一个 OR 值`y`和`y ⊆ x`。 

所以：```
F[x] = Σ ans[y]
       y⊆x
```这是一个经典的子集 zeta 变换关系。 

一旦全部`F[x]`值已知，我们使用子集莫比乌斯反演恢复准确的答案。 

剩下的任务就是计算`g[x]`。 

让`freq[v]`是值的频率`v`在数组中。 

然后：```
g[x] = Σ freq[s]
       s⊆x
```这正是 SOS DP 的子集和。 

由于只有`2^20 = 1,048,576`mask，20维SOS变换是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(C(n,k) · k) | O(C(n,k) · k) | O(OR 值的数量) | 太慢了|
 | 最佳 | O(20·2^20 + n + q) | O(20·2^20 + n + q) | O(2^20) | O(2^20) | 已接受 |

 ## 算法演练

 1.读取数组并构建频率数组`freq`， 在哪里`freq[v]`存储多少倍的值`v`出现。 
2. 预计算阶乘和逆阶乘模`10^9+7`最多`n`，允许常量时间计算组合。 
3. 复制`freq`到一个数组中`g`。 
4. 运行子集 SOS 变换`g`。 

经过这个变换后：```
g[x] = Σ freq[s]
       s⊆x
```它等于掩码是以下子集的数组元素的数量`x`。 
5. 每个面膜`x`，计算：```
F[x] = C(g[x], k)
```如果`g[x] < k`，该值为零。 
6. 应用子集莫比乌斯反演`F`。 

反转后：```
F[x] = Σ ans[y]
       y⊆x
```变成```
ans[x]
```直接地。 
7. 对于每个查询值`x`， 输出`ans[x]`。 

### 为什么它有效

 对于固定面罩`x`，唯一可以参与其 OR 包含在其中的子序列的元素`x`是其自己的掩码是子集的元素`x`。 SOS 变换精确计算存在多少个这样的元素。 

选择任何一个`k`这些元素给出一个子序列，其 OR 也是以下子集`x`， 所以`F[x] = C(g[x],k)`最多计算所有带有 OR 的子序列`x`。 

每个子序列都贡献一个 OR 值。 最后，`F[x]`是包含在所有掩码中的精确 OR 计数的总和`x`。 子集莫比乌斯求逆正是该求和的逆运算，因此它恢复了 OR 等于每个掩码的子序列的确切数量。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

MOD = 1000000007
B = 20
M = 1 << B

def main():
    n, k = map(int, input().split())

    freq = array('I', [0]) * M
    arr = list(map(int, input().split()))
    for x in arr:
        freq[x] += 1

    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i % MOD

    ifact = [1] * (n + 1)
    ifact[n] = pow(fact[n], MOD - 2, MOD)
    for i in range(n, 0, -1):
        ifact[i - 1] = ifact[i] * i % MOD

    def comb(nn, rr):
        if nn < rr:
            return 0
        return fact[nn] * ifact[rr] % MOD * ifact[nn - rr] % MOD

    g = array('I', freq)

    for bit in range(B):
        step = 1 << bit
        for mask in range(M):
            if mask & step:
                g[mask] += g[mask ^ step]

    dp = [0] * M
    for mask in range(M):
        dp[mask] = comb(g[mask], k)

    for bit in range(B):
        step = 1 << bit
        for mask in range(M):
            if mask & step:
                dp[mask] -= dp[mask ^ step]
                dp[mask] %= MOD

    q = int(input())
    out = []
    for _ in range(q):
        x = int(input())
        out.append(str(dp[x]))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```频率数组存储每个值在输入中出现的次数。 由于所有值均低于`2^20`，每个可能的掩码都有一个专用的插槽。 

SOS 变换将频率转换为子集计数。 完成后，`g[x]`包含可以出现在其 OR 不超过的子序列中的数组元素的数量`x`。 

使用阶乘和逆阶乘计算组合值。 由于模数是素数，费马定理提供了模逆。 

数组`dp`最初商店`F[x] = C(g[x],k)`。 第二个 SOS 式通道执行莫比乌斯反演。 减法步骤是子集累加的精确逆操作，并将“OR 包含在 x 内”计数转换为“OR 等于 x”计数。 

每次减法之后的模运算是必要的，因为中间值可能变成负数。 

## 工作示例

 ### 示例 1```
n = 3, k = 2
a = [1, 2, 3]
```相关口罩：

 | 面膜| g[掩码] | F[掩模] = C(g,k) |
 | ---| ---| ---|
 | 0 | 0 | 0 |
 | 1 | 1 | 0 |
 | 2 | 1 | 0 |
 | 3 | 3 | 3 |

 莫比乌斯反演后：

 | 面膜| 精确或计数 |
 | ---| ---|
 | 1 | 0 |
 | 2 | 0 |
 | 3 | 3 |

 这三个子序列是：```
{1,2} -> 3
{1,3} -> 3
{2,3} -> 3
```一切都贡献于面具`3`。 

### 示例 2```
n = 4, k = 2
a = [1,1,1,1]
```| 面膜| g[掩码] | F[掩码] |
 | ---| ---| ---|
 | 0 | 0 | 0 |
 | 1 | 4 | 6 |

 反转后：

 | 面膜| 精确或计数 |
 | ---| ---|
 | 0 | 0 |
 | 1 | 6 |

 此示例演示了子序列是按位置计数的。 尽管只有一种不同的值，但有六种不同的方式来选择两个位置。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(20·2^20 + n + q) | O(20·2^20 + n + q) | 两种 SOS 风格的变换占主导地位 |
 | 空间| O(2^20) | O(2^20) | 所有掩模上的频率和 DP 阵列 |`2^20`约为 100 万次，因此每个 SOS 转换执行大约 2000 万次更新。 这完全符合 2 秒 C++ 解决方案的限制，也是问题的预期复杂性。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    MOD = 1000000007
    B = 20
    M = 1 << B

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n, k = map(int, input().split())
    arr = list(map(int, input().split()))

    from array import array

    freq = array('I', [0]) * M
    for x in arr:
        freq[x] += 1

    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i % MOD

    ifact = [1] * (n + 1)
    ifact[n] = pow(fact[n], MOD - 2, MOD)
    for i in range(n, 0, -1):
        ifact[i - 1] = ifact[i] * i % MOD

    def C(nn, rr):
        if nn < rr:
            return 0
        return fact[nn] * ifact[rr] % MOD * ifact[nn - rr] % MOD

    g = array('I', freq)

    for bit in range(B):
        b = 1 << bit
        for mask in range(M):
            if mask & b:
                g[mask] += g[mask ^ b]

    dp = [0] * M
    for mask in range(M):
        dp[mask] = C(g[mask], k)

    for bit in range(B):
        b = 1 << bit
        for mask in range(M):
            if mask & b:
                dp[mask] = (dp[mask] - dp[mask ^ b]) % MOD

    q = int(input())
    ans = []
    for _ in range(q):
        ans.append(str(dp[int(input())]))
    return "\n".join(ans)

# custom cases
assert run("1 1\n1\n2\n1\n2\n") == "1\n0"
assert run("4 2\n1 1 1 1\n2\n1\n3\n") == "6\n0"
assert run("3 2\n1 2 4\n4\n3\n5\n6\n7\n") == "1\n1\n1\n0"
assert run("3 3\n7 7 7\n2\n7\n1\n") == "1\n0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单元素数组 |`1, 0`| 最小尺寸外壳 |
 | 所有值均相等 |`6, 0`| 正确的组合计数 |
 | 两个人的不同权力|`1,1,1,0`| 精确或重建 |
 |`k = n`|`1,0`| 仅存在一个子序列的边界 |

 ## 边缘情况

 考虑：```
n = 4
k = 2
a = [1,1,1,1]
query = 1
```SOS 变换给出：```
g[1] = 4
```所以：```
F[1] = C(4,2) = 6
```莫比乌斯反转叶`ans[1] = 6`。 该算法计算位置选择而不是不同的值，这正是问题所需要的。 

考虑：```
n = 3
k = 2
a = [1,2,2]
query = 7
```数组值不包含位`4`，所以每个子序列 OR 都包含在里面`3`。 

SOS 阶段仅根据现有掩码计算有效计数。 反转期间，掩模`7`没有收到任何贡献，留下：```
ans[7] = 0
```这是正确的。 

考虑：```
n = 3
k = 3
a = [1,2,4]
query = 7
```仅存在一个使用所有位置的子序列。 

该算法得到：```
g[7] = 3
F[7] = C(3,3) = 1
```并且反演产生：```
ans[7] = 1
```而其他所有掩码都收到零。 这证实了极端情况的正确处理`k = n`。
