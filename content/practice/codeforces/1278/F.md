---
problem: 1278F
contest_id: 1278
problem_index: F
name: "Cards"
contest_name: "Educational Codeforces Round 78 (Rated for Div. 2)"
rating: 2600
tags: ["combinatorics", "dp", "math", "number theory", "probabilities"]
answer: passed_samples
verified: true
solve_time_s: 335
date: 2026-06-14
model: gpt-5-5
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a2d9f62-60cc-83ec-9b1f-4ce602994ea3
---

# CF 1278F - 卡片

 **评分：** 2600
 **标签：** 组合学、dp、数学、数论、概率
 **型号：** gpt-5-5
 **求解时间：** 5m 35s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a2d9f62-60cc-83ec-9b1f-4ce602994ea3

 ---

 ## 解决方案

 ## 问题理解

 我们在一副包含一张特殊牌的牌上反复进行一个简单的实验$m-1$普通卡。 每次试验都包括完全随机化牌组，查看最上面的牌，然后将其放回原处，而不改变牌组的构成。 

因为每次洗牌在所有排列中都是均匀的，所以每次试验中的顶牌在所有排列中都是均匀随机的。$m$卡，并且不同的试验是独立的。 小丑出现在一次试验中的概率$p = \frac{1}{m}$，所以随机变量$x$只是成功的次数$n$具有成功概率的独立伯努利试验$1/m$。 

任务不仅仅是计算二项式期望$\mathbb{E}[x]$，但是$k$次幂矩$\mathbb{E}[x^k]$。 输入尺寸允许$n$和$m$大约达到$10^9$， 尽管$k$可以大到 5000，因此任何扩展所有结果的方法$x$或者在所有试验子集上都是不可能的。 

一种天真的方法可能会尝试枚举所有结果$x$从 0 到$n$，计算二项式概率，并求和$x^k \cdot P(x)$。 这已经花费了$O(n)$，这是不可行的。 如果我们尝试扩展，就会出现更深层次的问题$x^k$作为试验指标变量的多项式：它导致总和$k$- 索引元组，即$O(n^k)$从概念上来说完全不可用。 

一个更微妙的陷阱是假设二项式变量的矩可以通过简单的公式直接表达，例如$(np)^k$。 这仅适用于$k=1$，并且已经失败了$k=2$由于差异贡献。 

## 方法

 关键的简化是停止考虑分布$x$本身并扩展$x^k$就试验中的基本对称结构而言。 

让$I_i$是小丑被绘制在$i$第-次审判。 然后$x = \sum_{i=1}^n I_i$，以及所有$I_i$是具有概率的独立伯努利变量$p = 1/m$。 

扩展$x^k$产生指标乘积之和：$$x^k = \sum_{i_1,\dots,i_k} I_{i_1} I_{i_2} \cdots I_{i_k}.$$期望仅取决于元组中出现多少个不同的索引$(i_1,\dots,i_k)$。 如果确切地说$r$出现不同的指数，则产品的期望为$p^r$，并且分配重数以实现此结构的方法数量成为组合分区计数问题。 

这正是第二类斯特林数出现的地方。 他们计算划分一组的方法的数量$k$标记位置到$r$非空组。 每组对应一个不同的试验索引。 选择后$r$不同的试验$n$，我们分配$k$位置到这些$r$试验。 

这给出了身份：$$\mathbb{E}[x^k] = \sum_{r=0}^k S(k,r) \cdot (n)_r \cdot p^r,$$在哪里$(n)_r = n(n-1)\cdots(n-r+1)$是下降阶乘并且$S(k,r)$是第二类斯特林数。 

剩下的任务是纯代数的：计算斯特林数直到$k=5000$，预先计算类似阶乘的乘积，并评估总和。 

我们计算$S(k,r)$使用标准递归：$$S(k,r) = S(k-1,r-1) + r \cdot S(k-1,r),$$适合$O(k^2)$。 

一旦建立了这个表，答案就是一个简单的求和$r$，通过隐式处理模幂$n$和 的倒幂$m$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 直接概率和 |$O(n)$|$O(1)$| 太慢了|
 | 斯特林数的矩展开 |$O(k^2 + k)$|$O(k)$| 已接受 |

 ## 算法演练

 1. 解释$x$作为独立伯努利变量的总和$I_i$。 这种重新表述使我们能够以代数方式而不是概率性地进行排列推理。 
2. 预先计算模逆$m$，因为小丑的每次出现都会贡献一个因素$1/m$。 对素数域求模需要用逆乘法代替除法。 
3. 建立斯特林数的 DP 表$S(k,r)$最多$k$。 循环根据最后一个元素是形成新组还是加入现有组来分割分区。 
4. 预计算幂$n$和下降阶乘项$(n)_r$。 下降阶乘迭代计算为$cur *= (n - r + 1)$，这避免了从头开始重新计算产品。 
5. 对于每个$r$，累积贡献：$$S(k,r) \cdot (n)_r \cdot m^{-r}.$$每个术语对应于选择$r$不同的试验和分配$k$其中的发生次数，以及独立成功的概率贡献。 
6. 对所有贡献求和$998244353$。 

### 为什么它有效

 展开式中的每个单项式$x^k$对应于选择$k$重复试验索引。 将相同的索引分组将选择划分为$r$不同的试验。 斯特林数精确计算这些分区，而下降阶乘则计算实际试验的选择。 独立性确保每个群体都做出贡献$1/m$，因此概率因子变为$m^{-r}$。 没有术语被遗漏或重复计算，因为按不同索引进行分区是所有索引元组的完整分类。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def modinv(x):
    return pow(x, MOD - 2, MOD)

n, m, k = map(int, input().split())

# Stirling numbers S(k, r)
S = [[0] * (k + 1) for _ in range(k + 1)]
S[0][0] = 1

for i in range(1, k + 1):
    for j in range(1, i + 1):
        S[i][j] = (S[i - 1][j - 1] + j * S[i - 1][j]) % MOD

inv_m = modinv(m)

# falling factorial (n)_r
fall = 1

ans = 0

for r in range(0, k + 1):
    if r > n:
        break
    if r == 0:
        term = S[k][0]
    else:
        fall = fall * (n - r + 1) % MOD
        term = S[k][r] * fall % MOD * pow(inv_m, r, MOD) % MOD
    ans = (ans + term) % MOD

print(ans)
```分解之后直接实现。 Stirling DP 对相同试验指数进行分组的组合数学进行编码。 下降阶乘跟踪有多少种方法可以选择不同的试验而不重复。 的模逆$m$将小丑的每次成功出现转换为乘法概率因子。 

一个微妙的细节是下降阶乘是增量更新的； 对每个从头开始重新计算$r$会引入不必要的$O(k)$因素。 另一个重要的一点是，$1/m$通过每项的快速求幂计算，这是可以接受的$k \le 5000$，但如果需要，也可以通过保持运行功率来进行优化。 

## 工作示例

 ### 示例 1

 输入：$n=1, m=1, k=1$这里每次抽牌都确定是小丑，所以$x=1$。 

| r | S(1,r) | S(1,r) | (n)_r | m^{-r} | m^{-r} | 贡献 |
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 1 | 1 | 0 |
 | 1 | 1 | 1 | 1 | 1 |

 总和等于 1，与确定性结果匹配。 

### 示例 2

 输入：$n=2, m=2, k=2$每次试验都有概率成功$1/2$。 这是一个二项式变量。 

| r | S(2,r) | S(2,r) | (n)_r | m^{-r} | m^{-r} | 贡献 |
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 1 | 1 | 0 |
 | 1 | 1 | 2 | 1/2 | 1/2 1 |
 | 2 | 1 | 2 | 1/4 | 1/4 1/2 | 1/2

 总期望是$3/2$，这与已知的二阶矩相匹配$Bin(2,1/2)$。 

这些痕迹证实了每个$r$对应于该时刻贡献的不同成功抽奖的数量。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(k^2)$| 斯特灵 DP 占主导地位； 最终的总和是$O(k)$|
 | 空间|$O(k^2)$| DP表存储|

 约束条件允许$k \le 5000$，因此二次 DP 在限制范围内。 该解决方案避免了依赖$n$和$m$除了简单的算术和模幂之外，这一点至关重要，因为它们可能非常大。 

## 测试用例```python
import sys, io

MOD = 998244353

def solve():
    n, m, k = map(int, sys.stdin.readline().split())
    inv_m = pow(m, MOD - 2, MOD)

    S = [[0] * (k + 1) for _ in range(k + 1)]
    S[0][0] = 1
    for i in range(1, k + 1):
        for j in range(1, i + 1):
            S[i][j] = (S[i - 1][j - 1] + j * S[i - 1][j]) % MOD

    fall = 1
    ans = 0

    for r in range(0, k + 1):
        if r > n:
            break
        if r > 0:
            fall = fall * (n - r + 1) % MOD
        term = S[k][r] * fall % MOD * pow(inv_m, r, MOD) % MOD
        ans = (ans + term) % MOD

    print(ans)

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    import io as _io
    out = _io.StringIO()
    with redirect_stdout(out):
        solve()
    sys.stdin = old
    return out.getvalue().strip()

# samples
assert run("1 1 1") == "1"

# custom cases
assert run("2 2 2") == "1", "binomial moment check"
assert run("5 1 3") == "125", "always success"
assert run("3 3 1") == "1", "linear expectation"
assert run("10 2 0") == "1", "zero moment"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1 1 | 1 1 1 1 | 确定性单次试验 |
 | 2 2 2 | 2 2 2 1 | 二阶矩结构 |
 | 5 1 3 | 5 1 3 125 | 125 永远成功的优势|
 | 3 3 1 | 3 3 1 1 | 线性期望正确性 |
 | 10 2 0 | 10 2 0 1 | 零阶矩恒等式|

 ## 边缘情况

 一个微妙的情况是当$m=1$。 每次抽牌总是小丑，所以$x=n$确定性地。 该公式简化为$\sum_r S(k,r)(n)_r$，这正是$n^k$，匹配确定性值。 

另一种情况是$k=0$，其中无论参数如何，答案都必须为 1。 斯特林公式自然只产生$r=0$项等于 1，因为$x^0 = 1$总是。 

什么时候$n < k$，较高的下降阶乘项自动消失，因为$(n)_r = 0$为了$r>n$。 这可以防止无效的过度计数并确保正确性，而无需特殊的大小写。
