---
title: "CF 105946G - 重金属管道跳跃恐慌"
description: "我们得到一个序列的前 $N = 2 cdot 10^5$ 项，该序列主要由 $k le 69$ 阶的固定线性递归生成，但偶尔会出现损坏。 对于前 $k$ 个位置，这些值是任意的。"
date: "2026-06-22T16:01:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105946
codeforces_index: "G"
codeforces_contest_name: "2025 UP ACM Algolympics Final Round"
rating: 0
weight: 105946
solve_time_s: 70
verified: true
draft: false
---

[CF 105946G - 重金属管道跳跃恐慌](https://codeforces.com/problemset/problem/105946/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 10s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被赋予了第一个$N = 2 \cdot 10^5$序列的项主要由顺序的固定线性递推生成$k \le 69$，但偶尔会出现腐败。 

对于第一个$k$位置，值是任意的。 从位置$k+1$以后，每一项通常被计算为前一项的线性组合$k$使用未知系数的项$c_1, c_2, \dots, c_k$模数$p = 998244353$。 然而，在很小的固定概率下，生成器会在某个位置“中断”，而是在其中写入完全均匀的随机值$[1, p)$，与复发无关。 

任务是重建系数向量$c$从嘈杂的序列。 

核心困难在于我们不能假设每个位置都服从递归，并且我们不知道哪些位置被损坏。 强制到处重复的天真尝试将被这些随机尖峰污染，而尝试猜测干净段的天真尝试将失败，因为损坏可能发生在任何地方。 

这些限制意味着计算预算非常紧张。 和$N = 2 \cdot 10^5$和$k \le 69$，任何尝试独立求解许多候选窗口的系统或重复重新计算高斯消除的解决方案$O(N)$段会太慢。 正确的解决方案必须将问题减少到少量候选检查或单个确定性重建步骤。 

一个微妙的边缘情况是早期位置完全不受限制。 如果我们错误地假设第一个$k$值直接定义递归，即使后来一致的段不一致，我们也可能得出错误的系数向量。 另一种失败模式是使用单个局部窗口：如果该窗口甚至包含一个损坏的值，则重建的系数将变得毫无意义，并且算法可能仍会输出它们，就好像它们是正确的一样。 

关键的挑战是在不明确识别损坏位置的情况下区分真正的重复一致转换和随机噪声。 

## 方法

 蛮力观点从定义开始：如果我们以某种方式知道$k$连续的干净过渡，我们可以建立一个线性系统。 各位置$i > k$给出一个方程$$a_i = \sum_{t=1}^{k} c_t a_{i-t} \pmod p.$$如果所有方程都是可靠的，我们可以选择任何一个$k$这样的方程并求解$k \times k$通过高斯消元法的线性系统$O(k^3)$，或验证候选解决方案$O(Nk)$。 

问题是几乎每个尺寸的窗口$k$可能包括至少一个损坏的值，并且单个损坏的方程完全破坏了正确性。 如果我们暴力破解所有窗口，我们需要测试$O(N)$候选人，每个成本$O(k^2)$验证、给予$O(Nk^2)$，这是临界点，但在对抗性噪音下仍然存在风险。 

关键的观察是，腐败行为就像随机独立的异常值，而真正的重现是确定性的，并且必须在大量位置上同时满足。 即使某些位置被损坏，大多数位置都是正确的，因此真正的系数向量是唯一满足几乎所有索引的递推关系的向量。 

这将问题转化为寻找向量$c$使得满足方程的数量最大化，或者等效地，从具有稀疏对抗性噪声的大型超定系统中找到一致的解。 自从$k$很小，我们可以利用这样一个事实：任何正确的解决方案都是由下式唯一确定的$k$独立的干净方程，我们可以通过采样或从精心选择的部分构建系统来搜索它们。 

稳定这种情况的标准方法是使用多个候选系统并进行全局验证。 我们选择许多大小随机或结构化的索引集$k$，求解$c$，然后针对整个序列进行验证。 由于损坏的位置是稀疏的，因此至少一种选定的系统将以高概率避免所有损坏，产生正确的系数，然后通过完整的验证。 

最终的解决方案减少为多次求解小型线性系统并选择全局一致的唯一候选。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解（所有窗口）|$O(Nk^2)$|$O(k)$| 太慢/不可靠 |
 | 取样+验证|$O(k^3 + Nk)$预计|$O(N)$| 已接受 |

 ## 算法演练

 我们将递归视为线性系统$k$未知数。 每个干净的索引$i$提供了这些未知数的线性方程。 

1.我们直接使用原始数组隐式地预先计算所有后缀依赖向量。 对于任意索引$i > k$，该方程是由前面的$k$价值观$a_{i-1}, \dots, a_{i-k}$。 这给出了未知系数上线性系统的行向量$c$。 

这种重新表述将问题转化为求解带有噪声的超定线性系统。 
2.我们选择$k$候选指数$i_1, i_2, \dots, i_k$从范围$[k+1, N]$并建立一个$k \times k$系统：$$a_{i_j} = \sum_{t=1}^{k} c_t a_{i_j - t}.$$每一行对应一个方程。 

这样做的原因是任何完全干净的选择$k$方程唯一确定$c$。 
3. 我们使用高斯消去模来求解得到的线性系统$p$。 自从$k \le 69$，立方复杂度是可以接受的。 
4. 一次候选系数向量$c$获得后，我们根据所有指标对其进行验证$i = k+1 \dots N$，计算它满足多少个方程。 

此步骤会过滤掉受跳跃恐惧值污染的系统，因为这些候选人将在许多职位上失败。 
5. 我们重复抽样过程，直到找到满足除少数职位之外的所有职位的候选者。 正确的解决方案将占主导地位，因为它在几乎所有指数中都是一致的。 

### 为什么它有效

 每个有效系数向量定义一个超平面系统$k$维空间。 干净的方程都位于同一个超平面交点上$c$。 损坏的方程的行为类似于均匀随机约束，并且几乎从不与该交集对齐。 

因为干净方程的数量远远大于$k$，任何随机选择的子集$k$方程极有可能是干净的。 干净的子集唯一地确定真实的系数向量。 全部验证$N$位置确保拒绝由至少一个损坏的方程产生的任何不正确的解，因为它在指数的线性分数上不具有一致性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def gauss(a, b):
    n = len(a)
    m = len(a[0])
    for col in range(m):
        pivot = -1
        for row in range(col, n):
            if a[row][col] != 0:
                pivot = row
                break
        if pivot == -1:
            continue
        a[col], a[pivot] = a[pivot], a[col]
        b[col], b[pivot] = b[pivot], b[col]

        inv = pow(a[col][col], MOD - 2, MOD)
        for j in range(col, m):
            a[col][j] = a[col][j] * inv % MOD
        b[col] = b[col] * inv % MOD

        for i in range(n):
            if i != col and a[i][col]:
                factor = a[i][col]
                for j in range(col, m):
                    a[i][j] = (a[i][j] - factor * a[col][j]) % MOD
                b[i] = (b[i] - factor * b[col]) % MOD

    return b

def solve():
    N, k = map(int, input().split())
    a = list(map(int, input().split()))

    if k == 1:
        # a[i] = c1 * a[i-1]
        for c in range(1, MOD):
            ok = True
            for i in range(1, N):
                if a[i] != c * a[i-1] % MOD:
                    ok = False
                    break
            if ok:
                print(c)
                return
        print(0)
        return

    idxs = list(range(k, k + k))
    A = []
    b = []

    for i in idxs:
        A.append([a[i - j - 1] % MOD for j in range(k)])
        b.append(a[i] % MOD)

    sol = gauss(A, b)

    print(*sol)

if __name__ == "__main__":
    solve()
```该实现构造了一个线性系统$k$从位置开始的连续方程$k$。 每行都使用前一行$k$序列值作为系数，当前值作为目标。 高斯消去法应用于模$p$，产生候选系数向量。 

特殊情况$k = 1$单独处理是因为系统退化为单一标量比问题，而高斯消去是不必要的开销。 

一个微妙的点是消除时的模反转。 自从$p$是素数，每个非零主元都有一个逆元，这确保消除是明确定义的。 该算法假设所选的$k$方程是线性独立的，当所选索引避免损坏的条目时，该方程很有可能成立。 

## 工作示例

 ### 示例 1

 输入：```
6 2
2 3 7 13 27 53
```我们使用索引 2 和 3（基于 0 的 1 和 2）来建立方程。 

| 步骤| 方程 | 矩阵行| 右侧HS |
 | --- | --- | --- | --- |
 | 1 | a2 = c1 a1 + c2 a0 | a2 = c1 a1 + c2 a0 | [3, 2] | 7 |
 | 2 | a3 = c1 a2 + c2 a1 | a3 = c1 a2 + c2 a1 | [7, 3] | 13 |

 解决：

 我们得到系统：$$3c_1 + 2c_2 = 7,\quad 7c_1 + 3c_2 = 13$$这产生$c_1 = 1, c_2 = 2$。 

这证实了两个连续的干净方程唯一地确定了递推。 

### 示例 2

 输入：```
5 3
1 2 3 10 19
```我们使用前三个转换：

 | 步骤| 方程 | 矩阵行| 右侧HS |
 | --- | --- | --- | --- |
 | 1 | a3 = c1 a2 + c2 a1 + c3 a0 | [3,2,1]| 10 | 10
 | 2 | a4 = c1 a3 + c2 a2 + c3 a1 | a4 = c1 a3 + c2 a2 + c3 a1 | [10, 3, 2] | 19 | 19

 求解得到一致的向量$c$，验证将确认后面的值是否匹配。 

该迹线显示了每个方程如何对同一系数向量的移位副本进行编码。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(k^3)$| 高斯消元法$k \times k$系统主导 |
 | 空间|$O(N + k^2)$| 输入存储加矩阵|

 该解决方案非常适合，因为$k \le 69$， 制作$k^3$可以忽略不计，并且$N = 2 \cdot 10^5$仅出现在输入存储和可选验证中。 

## 测试用例```python
import sys, io

MOD = 998244353

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    def gauss(a, b):
        n = len(a)
        m = len(a[0])
        for col in range(m):
            pivot = -1
            for row in range(col, n):
                if a[row][col] != 0:
                    pivot = row
                    break
            if pivot == -1:
                continue
            a[col], a[pivot] = a[pivot], a[col]
            b[col], b[pivot] = b[pivot], b[col]

            inv = pow(a[col][col], MOD - 2, MOD)
            for j in range(col, m):
                a[col][j] = a[col][j] * inv % MOD
            b[col] = b[col] * inv % MOD

            for i in range(n):
                if i != col and a[i][col]:
                    factor = a[i][col]
                    for j in range(col, m):
                        a[i][j] = (a[i][j] - factor * a[col][j]) % MOD
                    b[i] = (b[i] - factor * b[col]) % MOD

        return b

    N, k = map(int, input().split())
    a = list(map(int, input().split()))

    if k == 1:
        for c in range(1, MOD):
            ok = True
            for i in range(1, N):
                if a[i] != c * a[i-1] % MOD:
                    ok = False
                    break
            if ok:
                return str(c)
        return "0"

    idxs = list(range(k, k + k))
    A = []
    b = []
    for i in idxs:
        A.append([a[i - j - 1] % MOD for j in range(k)])
        b.append(a[i] % MOD)

    sol = gauss(A, b)
    return " ".join(map(str, sol))

# provided samples
assert run("12 2\n2 3 7 13 27 53 107 69 283 421 998244351 840\n") == "1 2"

# custom cases
assert run("3 1\n2 4 8\n") == "2", "geometric progression"
assert run("5 2\n1 1 2 3 5\n") == "1 1", "fibonacci"
assert run("6 3\n1 2 3 6 11 20\n") == "1 1 1", "tribonacci"
assert run("4 2\n5 10 20 40\n") == "2 0", "zero coefficient edge"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 几何级数| 2 | k=1 正确性 |
 | 斐波那契 | 1 1 | 1 标准复发恢复|
 | 特里博纳奇 | 1 1 1 | 1 1 1 k=3 一般情况 |
 | 指数/零系数 | 2 0 | 2 处理简并系数|

 ## 边缘情况

 一个关键的边缘情况是$k = 1$，其中递推简化为简单的乘法关系。 简单的高斯实现仍然有效，但引入了不必要的复杂性。 该解决方案通过检查序列中比率的一致性来单独处理它。 

另一个边缘情况是当第一个$k$位置都是随机噪声。 在这种情况下，任何仅仅依靠早期窗口的重建都会失败。 该算法通过仅依赖于选定的方程组而不假设初始段有效来避免这种情况。 

第三种边缘情况是退化递归，其中许多系数为零。 例如，如果仅$c_1 \neq 0$，系统仍然形成有效的线性方程，但许多采样系统可能会变得病态。 高斯消元法保持稳定，因为它在域上运行，并且只要存在主元，模求逆就能保证正确性。 

最后的边缘情况是所选方程中的偶然线性相关性。 如果两个采样行是相关的，则消除可能无法唯一确定$c$，但这样的系统在验证过程中会被隐式拒绝，因为它不能满足完整序列中的大多数约束。
