---
title: "CF 1288C - 两个阵列"
description: "我们需要计算数组对 $(a,b)$，长度均为 $m$，其值介于 $1$ 和 $n$ 之间。 数组 $a$ 必须是非递减的，数组 $b$ 必须是非递增的，并且在每个位置我们都需要 $ai le bi$。 答案可能非常大，因此我们输出它对 $10^9+7$ 取模。"
date: "2026-06-11T19:02:18+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "dp"]
categories: ["algorithms"]
codeforces_contest: 1288
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 80 (Rated for Div. 2)"
rating: 1600
weight: 1288
solve_time_s: 211
verified: true
draft: false
---

[CF 1288C - 两个数组](https://codeforces.com/problemset/problem/1288/C)

 **评分：** 1600
 **标签：** 组合数学，dp
 **求解时间：** 3m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要计算数组对$(a,b)$, 两者的长度$m$，其值介于$1$和$n$。 

大批$a$必须是非递减数组$b$必须是非增加的，并且在我们需要的每个位置$a_i \le b_i$。 

答案可能非常大，所以我们输出它的模$10^9+7$。 

首先要注意的是$m$最多是很小$10$， 尽管$n$可以达到$1000$。 任何复杂度为多项式的解$n$和$m$很好。 尝试枚举数组的解决方案是没有希望的，因为可能的数组数量是指数级的。 即使是为了$n=1000$和$m=10$， 有$1000^{10}$可能的数组。 

有趣的部分是单调性约束和条件之间的相互作用$a_i \le b_i$。 数组不是独立的。 

考虑一个小例子：```
n = 2, m = 2
```有效对正是声明中列出的五对。 

一个常见的错误是计算非递减数组$a$和非增数组$b$分开，然后尝试将它们组合起来。 这忽略了位置约束$a_i \le b_i$。 例如，$$a=[1,2],\qquad b=[1,1]$$满足单调性要求但违反了$a_2 \le b_2$。 

另一个微妙的情况是当$n=1$。```
1 10
```每个元素都必须是$1$，所以只有一对有效的：$$a=[1,1,\ldots,1],\quad b=[1,1,\ldots,1].$$任何意外假定多个值可用的公式都会出现过度计算。 

当相等频繁出现时，就会出现第三种边缘情况。 例如：```
2 1
```有效对是$$(1,1),\ (1,2),\ (2,2).$$答案是$3$， 不是$2$。 治疗的解决方案$a_i<b_i$而不是$a_i\le b_i$失去所有相等的对。 

## 方法

 蛮力方法很简单。 生成每个非递减数组$a$，生成每个非增数组$b$，并检查是否$a_i\le b_i$对于所有职位。 

长度非递减数组的数量$m$超值$1\ldots n$是$$\binom{n+m-1}{m}.$$为了$n=1000$和$m=10$，这已经是$2.8\times10^{23}$。 枚举它们是完全不可能的。 

关键的观察是两个数组可以合并成一个单调序列。 

写出以下值$a$从左到右：$$a_1 \le a_2 \le \cdots \le a_m.$$现在写出值$b$按相反顺序：$$b_m \le b_{m-1} \le \cdots \le b_1.$$因为$a_i \le b_i$，中间连接也遵循顺序：$$a_m \le b_m.$$结合一切给出$$a_1 \le a_2 \le \cdots \le a_m \le b_m \le b_{m-1} \le \cdots \le b_1.$$这只是一个长度不减的序列$2m$其价值观在于$1\ldots n$。 

相反，每个非递减长度序列$2m$唯一确定有效对$(a,b)$：$$a_i = s_i, \qquad b_i = s_{2m-i+1}.$$所以原来的问题完全等价于计算长度非递减序列$2m$超过$n$价值观。 

这是一个经典的星条计数法：$$\binom{n+2m-1}{2m}.$$由于模数是素数并且$n+2m-1 \le 1019$，我们可以有效地计算这个二项式系数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| 指数| 太慢了|
 | 最佳| O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 让$$N = n + 2m - 1, \qquad K = 2m.$$2. 观察每对有效的$(a,b)$对应于非递减序列$$a_1,\ldots,a_m,b_m,\ldots,b_1$$长度$2m$。 
3. 观察每个非递减长度序列$2m$超值$1\ldots n$准确地重建一对有效的。 

对应关系是双射的，因此计数对与计数此类序列相同。 
4. 计算长度非递减序列$2m$使用星号和条形。 

尺寸多组数$2m$选自$n$值等于$$\binom{n+2m-1}{2m}.$$5. 计算二项式系数模$10^9+7$。 

由于模数是素数，因此使用阶乘和模逆：$$\binom{N}{K} = \frac{N!}{K!(N-K)!}.$$6. 输出结果。 

### 为什么它有效

 整个解决方案依赖于双射。 

给定一个有效的对$(a,b)$，序列$$a_1,\ldots,a_m,b_m,\ldots,b_1$$是非减的，因为$a$是非减的，$b$是非增加的，并且条件$a_m\le b_m$连接两半。 

给定任何长度不递减的序列$2m$，将其前半部分分配给$a$下半场逆转为$b$自动产生一个非递减的$a$，非增$b$， 和$a_i\le b_i$对于每个职位。 这两种结构是互逆的，因此映射是一对一的。 

因此答案正是长度非递减序列的数量$2m$超过$n$可能的值，即$\binom{n+2m-1}{2m}$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

n, m = map(int, input().split())

N = n + 2 * m - 1
K = 2 * m

fact = [1] * (N + 1)
for i in range(1, N + 1):
    fact[i] = fact[i - 1] * i % MOD

inv_fact = [1] * (N + 1)
inv_fact[N] = pow(fact[N], MOD - 2, MOD)

for i in range(N, 0, -1):
    inv_fact[i - 1] = inv_fact[i] * i % MOD

ans = fact[N]
ans = ans * inv_fact[K] % MOD
ans = ans * inv_fact[N - K] % MOD

print(ans)
```代码直接实现了组合公式。 

价值$N=n+2m-1$是二项式系数的顶部并且$K=2m$是底部。 

阶乘是预先计算的模$10^9+7$。 由于模数是素数，费马定理给出$$x^{-1} \equiv x^{MOD-2} \pmod{MOD}.$$计算反阶乘$N$首先，然后向后填充剩余的逆阶乘是标准的线性时间技术。 

最大可能$N$是$$1000 + 20 - 1 = 1019,$$因此阵列很小并且可以在限制范围内舒适地安装。 

## 工作示例

 ### 示例 1

 输入：```
2 2
```我们计算：$$N = 2 + 4 - 1 = 5, \qquad K = 4.$$| 变量| 价值|
 | ---| ---|
 | n | 2 |
 | 米 | 2 |
 | 尼 | 5 |
 | 克 | 4 |
 | 回答 |$\binom{5}{4}=5$|

 输出：```
5
```此示例演示了双射。 有效对完全对应于长度为四的五个非递减序列$\{1,2\}$。 

### 示例 2

 输入：```
1 3
```我们计算：$$N = 1 + 6 - 1 = 6, \qquad K = 6.$$| 变量| 价值|
 | ---| ---|
 | n | 1 |
 | 米 | 3 |
 | 尼 | 6 |
 | 克 | 6 |
 | 回答 |$\binom{6}{6}=1$|

 输出：```
1
```仅有价值$1$存在，因此两个数组中的每个位置都是强制的。 该公式正确返回一对有效的值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m) | 构建阶乘和反阶乘数组高达$n+2m-1$|
 | 空间| O(n + m) | 阶乘表的存储 |

 自从$n+2m-1\le1019$，实际运行时间很小。 该解决方案可以轻松满足 1 秒时间限制和 256 MB 内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import io
import sys

def solve():
    MOD = 10**9 + 7

    n, m = map(int, input().split())

    N = n + 2 * m - 1
    K = 2 * m

    fact = [1] * (N + 1)
    for i in range(1, N + 1):
        fact[i] = fact[i - 1] * i % MOD

    inv_fact = [1] * (N + 1)
    inv_fact[N] = pow(fact[N], MOD - 2, MOD)

    for i in range(N, 0, -1):
        inv_fact[i - 1] = inv_fact[i] * i % MOD

    ans = fact[N]
    ans = ans * inv_fact[K] % MOD
    ans = ans * inv_fact[N - K] % MOD

    print(ans)

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    global input
    input = sys.stdin.readline

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out

# provided sample
assert run("2 2\n") == "5\n", "sample 1"

# minimum size
assert run("1 1\n") == "1\n", "minimum"

# single position
assert run("2 1\n") == "3\n", "all valid pairs"

# only one value available
assert run("1 10\n") == "1\n", "forced arrays"

# another small hand-checkable case
assert run("2 3\n") == "7\n", "C(7,6)=7"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1`|`1`| 尽可能小的实例 |
 |`2 1`|`3`| 正确处理平等|
 |`1 10`|`1`| 只有一个可用值 |
 |`2 3`|`7`| 正确的星条公式 |

 ## 边缘情况

 考虑：```
1 10
```该算法计算$$\binom{1+20-1}{20} = \binom{20}{20} = 1.$$只有一个非递减长度序列$20$存在，即一切。 这映射到唯一有效的数组对。 

考虑：```
2 1
```该算法计算$$\binom{2+2-1}{2} = \binom{3}{2} = 3.$$这三对是$(1,1)$,$(1,2)$， 和$(2,2)$。 相等的情况会被自然地计数，因为星形和条形计算的是多重集而不是严格递增的序列。 

考虑：```
2 2
```合并后的序列有长度$4$。 值上非递减序列的数量$\{1,2\}$是$$\binom{5}{4}=5.$$重建$a$从前两个位置开始，$b$从反转的最后两个位置恰好产生五个有效对。 双射保证不会遗漏任何有效对，并且不会对任何有效对进行两次计数。
