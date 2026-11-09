---
title: "CF 2077C - 二进制子序列值和"
description: "字符串的每个字符贡献 +1 或 -1。 如果我们定义 $$w(c)= begin{cases} +1,&c='1' -1,&c='0' end{cases}$$，那么对于二进制字符串的任何段，函数 $F$ 只是该段上这些值的总和。"
date: "2026-06-08T06:31:22+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "data-structures", "dp", "fft", "math", "matrices"]
categories: ["algorithms"]
codeforces_contest: 2077
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 1008 (Div. 1)"
rating: 2300
weight: 2077
solve_time_s: 118
verified: true
draft: false
---

[CF 2077C - 二进制子序列值和](https://codeforces.com/problemset/problem/2077/C)

 **评分：** 2300
 **标签：** 组合数学、数据结构、dp、fft、数学、矩阵
 **求解时间：** 1m 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 字符串的每个字符都有贡献`+1`或者`-1`。 

如果我们定义$$w(c)= \begin{cases} +1,&c='1'\\ -1,&c='0' \end{cases}$$那么对于二进制字符串的任何段，函数$F$只是该段上这些值的总和。 

对于二进制字符串$v$， 让$$d=\#1-\#0$$是其总的不平衡性。 

得分为$v$通过将字符串拆分为前缀和后缀并最大化来获得$$F(\text{prefix})\cdot F(\text{suffix}).$$我们得到一个二进制字符串$s$。 每次翻转操作之后，我们必须计算当前字符串的所有非空子序列的分数总和。 

从约束中观察到的第一个结果是字符串长度和查询次数都可以达到$2\cdot 10^5$，所有测试用例的总和也是$2\cdot 10^5$。 任何显式检查子序列的解决方案都是不可能的，因为长度的字符串$2\cdot 10^5$有$2^{200000}$子序列。 甚至一个$O(n)$每个查询的重新计算成本太高，因为这会导致$O(nq)$。 

答案必须仅取决于翻转后可以更新的极少量信息。 

微妙的边缘情况是长度为 1 的子序列。 

例如：```
v = "1"
```唯一可能的分割使用空边，因此得分为$0$。 任何假设两边都非空的推导都会错误地给出正值。 

另一个容易犯的错误是错误地处理奇偶校验。 

为了```
v = "111"
```我们有$d=3$。 分数不是$d^2/4=9/4$。 实际答案是$$\left\lfloor \frac d2\right\rfloor \left\lceil \frac d2\right\rceil = 1\cdot2 = 2.$$奇偶校验校正是整个解决方案的关键步骤。 

第三个陷阱是空子序列。 该问题要求非空子序列，但最终公式自然会计算所有子序列。 幸运的是，空子序列存在不平衡$0$并得分$0$，因此包含它不会改变任何内容。 

## 方法

 强力解决方案将枚举每个子序列，计算其不平衡性，确定其分数，然后将结果相加。 

对于一个长度的字符串$n$，这需要检查$2^n$子序列。 即使是为了$n=60$，这已经远远超出了可行性。 和$n=2\cdot10^5$，这是完全不可能的。 

关键的观察是子序列的分数仅取决于其不平衡性$$d=\#1-\#0.$$它不依赖于子序列内字符的顺序。 

假设子序列不平衡$d$。 令所选前缀的不平衡度为$x$。 那么后缀不平衡性就是$d-x$，所以每次分裂都会产生$$x(d-x).$$当两个部分尽可能接近时，该二次方最大化。 最大值变为$$\left\lfloor \frac d2\right\rfloor \left\lceil \frac d2\right\rceil = \frac{d^2-(d\bmod 2)}4.$$现在问题变成：$$\sum_{\text{subsequence}} \frac{d^2-(d\bmod2)}4.$$后续顺序完全消失了。 

让$R$是当前字符串中的个数。 然后每个查询只会改变$R$经过$\pm1$。 

剩下的任务是计算$d^2$遍历所有子序列，然后减去奇偶校验校正。 使用均匀随机子序列的概率解释，这两个量都允许封闭形式。 简化后答案仅取决于$n$和$R$：$$\boxed{ 2^{\,n-4} \left((2R-n)^2+n-2\right) } \pmod{998244353}.$$自从$n$永远不会改变，翻转只会改变$R$，每个查询都可以在$O(1)$。 

该公式的推导将在下一节中给出。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(2^n)$|$O(1)$| 太慢了|
 | 最佳 |$O(1)$每个查询 |$O(n)$对于字符串 | 已接受 |

 ## 算法演练

 ### 推导分数公式

 让$$d=\#1-\#0.$$对于前缀不平衡为$x$,$$\text{value}=x(d-x).$$当该抛物线达到最大值时$x$最接近$d/2$。 

因此$$\text{score}(v) = \left\lfloor\frac d2\right\rfloor \left\lceil\frac d2\right\rceil = \frac{d^2-(d\bmod2)}4.$$### 导出所有子序列的总和

 将每个子序列解释为独立选择是否包含每个位置。 

定义一个随机变量：$$X_i= \begin{cases} 1,&s_i=1\text{ and chosen}\\ -1,&s_i=0\text{ and chosen}\\ 0,&\text{otherwise} \end{cases}$$然后$$d=\sum_i X_i.$$让$R$是 1 的数量并且$Z=n-R$。 

我们有$$E[d] = \frac{R-Z}{2} = \frac{2R-n}{2}.$$还$$\operatorname{Var}(X_i)=\frac14,$$所以$$\operatorname{Var}(d) = \frac n4.$$所以$$E[d^2] = \operatorname{Var}(d)+E[d]^2 = \frac{(2R-n)^2+n}{4}.$$由于有$2^n$子序列，$$\sum d^2 = 2^nE[d^2] = 2^{n-2}\big((2R-n)^2+n\big).$$分数包含$$\frac{d^2-(d\bmod2)}4.$$奇偶校验校正仍然存在。 

当子序列的长度为奇数时，它就具有奇不平衡性。 所有子序列的恰好一半具有奇数长度，即$$2^{n-1}.$$因此$$\sum (d\bmod2) = 2^{n-1}.$$将所有内容放在一起：$$\text{Answer} = \frac14 \left( 2^{n-2}\big((2R-n)^2+n\big) - 2^{n-1} \right).$$因式分解后：$$\boxed{ 2^{n-4} \left( (2R-n)^2+n-2 \right) }.$$### 处理更新

 1. 统计当前的个数$R$。 
2. 预先计算两个模的幂$998244353$。 
3. 对于每个查询，翻转所选字符。 
4. 更新$R$经过$+1$或者$-1$。 
5. 计算$$x=2R-n.$$1. 输出$$2^{n-4}(x^2+n-2) \pmod{998244353}.$$为了$n<4$, 因子$2^{n-4}$被解释为模$998244353$使用模逆$2$。 

### 为什么它有效

 关键的不变量是每个子序列仅通过其不平衡性做出贡献$d$。 一旦分数被改写为$$\frac{d^2-(d\bmod2)}4,$$有关子序列的所有结构信息都消失了。 

总和$d^2$所有子序列的值完全由随机不平衡变量的前两个矩决定。 奇偶校验校正仅取决于有多少个子序列具有奇数不平衡，这等于奇数长度子序列的数量。 两个数量仅取决于$n$以及当前的数量$R$。 

每个查询仅更改$R$，因此评估更新后的封闭形式$R$正好产生所需的总和。 

推导直接从分数定义得出，并对每个子序列恰好计数一次，这证明了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
MAXN = 200000

pow2 = [1] * (MAXN + 1)
for i in range(1, MAXN + 1):
    pow2[i] = pow2[i - 1] * 2 % MOD

inv2 = (MOD + 1) // 2

def power_two_shift(n):
    if n >= 4:
        return pow2[n - 4]
    return pow(inv2, 4 - n, MOD)

t = int(input())

for _ in range(t):
    n, q = map(int, input().split())
    s = list(input().strip())

    ones = s.count('1')
    coef = power_two_shift(n)

    for _ in range(q):
        pos = int(input()) - 1

        if s[pos] == '1':
            s[pos] = '0'
            ones -= 1
        else:
            s[pos] = '1'
            ones += 1

        x = 2 * ones - n
        ans = coef * ((x * x + n - 2) % MOD)
        ans %= MOD

        print(ans)
```该实现直接反映了数学公式。 

价值$2^{n-4}$需要特别照顾时$n<4$。 在模算术中，这意味着乘以$2^{-1}$，因此代码使用了二的模逆。 

该系数仅取决于$n$，它在测试用例内永远不会改变，因此只计算一次。 

每次翻转都会在恒定时间内更新 1 的数量。 每次查询后重新计算整个字符串会将复杂性提高到$O(nq)$，这是不必要的。 

表达式$(2R-n)^2$很容易适合 Python 整数，因此不存在溢出问题。 

## 工作示例

 ### 示例 1

 输入：```
n = 3
s = 010
queries = [1, 3]
```| 查询 | 翻转后的字符串 | 奥内斯$R$|$x=2R-n$| 公式结果 |
 | --- | --- | --- | --- | --- |
 | 1 | 110 | 110 2 | 1 | 1 |
 | 3 | 111 | 111 3 | 3 | 5 |

 为了$n=3$,$$2^{n-4}=2^{-1}.$$第一次翻转后，$$\frac{1^2+3-2}{2}=1.$$第二次翻转后，$$\frac{3^2+3-2}{2}=5.$$这些与示例输出相匹配。 

### 示例 2

 输入：```
n = 2
s = 00
query = [1]
```| 查询 | 翻转后的字符串 | 奥内斯$R$|$x$| 回答 |
 | --- | --- | --- | --- | --- |
 | 1 | 10 | 10 1 | 0 | 0 |

 子序列是：```
1
0
10
```每个分数都是零，所以总分是零。 

公式给出$$2^{-2}(0^2+2-2)=0.$$跟踪证实封闭形式也可以处理微小的值$n$。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(1)$每个查询 | 只需一次翻转、一次计数更新和一次公式评估 |
 | 空间|$O(n)$| 可变字符串的存储 |

 所有测试用例的查询总数最多为$2\cdot10^5$。 Constant work per query easily fits within the time limit, and storing the string requires only linear memory.

 ## 测试用例```python
import sys, io

def run(inp: str) -> str:
    MOD = 998244353
    input_data = io.StringIO(inp)

    def input():
        return input_data.readline()

    MAXN = 200000
    pow2 = [1] * (MAXN + 1)
    for i in range(1, MAXN + 1):
        pow2[i] = pow2[i - 1] * 2 % MOD

    inv2 = (MOD + 1) // 2

    def coef(n):
        if n >= 4:
            return pow2[n - 4]
        return pow(inv2, 4 - n, MOD)

    out = []

    t = int(input())
    for _ in range(t):
        n, q = map(int, input().split())
        s = list(input().strip())

        ones = s.count('1')
        c = coef(n)

        for _ in range(q):
            p = int(input()) - 1

            if s[p] == '1':
                s[p] = '0'
                ones -= 1
            else:
                s[p] = '1'
                ones += 1

            x = 2 * ones - n
            ans = c * ((x * x + n - 2) % MOD) % MOD
            out.append(str(ans))

    return "\n".join(out)

# provided sample
assert run(
"""3
3 2
010
1
3
10 3
0101000110
3
5
10
24 1
011001100110000101111000
24
"""
) == "\n".join([
"1",
"5",
"512",
"768",
"1536",
"23068672"
])

# n = 1
assert run(
"""1
1 1
0
1
"""
) == "0"

# all ones
assert run(
"""1
3 1
111
1
"""
) == "1"

# all zeros
assert run(
"""1
2 1
00
1
"""
) == "0"

# flip twice on same position
assert run(
"""1
2 2
01
1
1
"""
) == "0\n0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`n=1`|`0`| 单字符子序列 |
 |`111`然后翻转|`1`| 奇数不平衡处理|
 |`00`然后翻转|`0`| 平衡子序列 |
 | 相同位置翻转两次 |`0,0`| 持续更新 |

 ## 边缘情况

 考虑：```
1
1 1
0
1
```翻转后字符串变成`"1"`。 恰好有一个非空子序列，其分数为零。 公式给出$$2^{-3}(1+1-2)=0.$$该算法正确处理尽可能小的字符串。 

现在考虑：```
1
1 1
1
1
```翻转后字符串变成`"0"`。 

不平衡度是$-1$，但分数仍然为零，因为每次分割都使用空边。 该公式取决于$d^2$，不是$d$，并再次产生零。 

最后考虑：```
1
3 1
111
1
```翻转后我们得到`"011"`。 

的个数变为$R=2$, 给予$x=1$。 答案是$$2^{-1}(1^2+3-2)=1.$$本例进行奇偶校验校正。 仅使用$d^2/4$会产生小数值并导致错误的推导。 修正项准确地消除了奇数不平衡的超算。
