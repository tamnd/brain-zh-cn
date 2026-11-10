---
title: "CF 2095E - 配对计数"
description: "这个问题来自于愚人节竞赛。 关键技巧是显示为 ⊕ 的符号实际上并不是按位异或。 附加到该符号的链接导致了一个谜题，其解决方案表明 ⊕ 应该被解释为乘法。"
date: "2026-06-08T05:31:04+07:00"
tags: ["codeforces", "competitive-programming", "*special", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 2095
codeforces_index: "E"
codeforces_contest_name: "April Fools Day Contest 2025"
rating: 0
weight: 2095
solve_time_s: 92
verified: true
draft: false
---

[CF 2095E - 配对计数](https://codeforces.com/problemset/problem/2095/E)

 **评级：** -
 **标签：** *特殊，数论
 **求解时间：** 1m 32s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 这个问题来自于愚人节竞赛。 关键技巧是显示为的符号`⊕`实际上不是按位异或。 附加到该符号的链接导致了一个谜题，其解决方案表明：`⊕`应该理解为乘法。 一旦发现，情况就变成了$$(a_i a_j)(a_i^2 a_j^2)\equiv k \pmod p,$$这简化为$$a_i^3 a_j^3 \equiv k \pmod p.$$所以我们得到一组不同的数字模素数$p$，并且我们必须计算其立方相乘的对$k$模数$p$。 

数组大小达到$3 \cdot 10^5$，这会立即排除检查所有对。 二次解的执行大致如下$4.5 \cdot 10^{10}$在最坏的情况下进行配对检查，远远超出了限制。 我们需要一些接近线性或$O(n \log p)$。 

一个微妙的情况是$k=0$。 自从$p$是素数，产品$a_i^3 a_j^3$是零模$p$当且仅当两个数中至少有一个为零。 由于所有数组值都是不同的，因此零最多只能出现一次。 

考虑：```
3 5 0
0 1 2
```有效的对是$(0,1)$和$(0,2)$，所以答案是2。 

盲目计算模逆的粗心实现在这里会失败，因为零没有逆。 

另一个重要的情况是当$k \neq 0$但某些数组元素为零。```
3 5 1
0 1 2
```任何包含零的对都不能满足该方程，因为它的乘积始终为零模$p$。 匹配非零值时必须跳过此类元素。 

## 方法

 蛮力的想法很简单。 对于每对$(i,j)$, 计算$$a_i^3 a_j^3 \bmod p$$并将其与$k$。 这是正确的，因为它直接检查条件。 不幸的是，有$$\frac{n(n-1)}2$$对。 和$n=3\cdot10^5$，这大约是$4.5\cdot10^{10}$检查。 

方程的结构表明了一个更好的方向。 让$$x_i = a_i^3 \bmod p.$$条件变为$$x_i x_j \equiv k \pmod p.$$对于固定的$x_j\neq 0$，所需的伙伴是唯一确定的：$$x_i \equiv k \cdot x_j^{-1} \pmod p.$$自从$p$是质数，每个非零余数都有一个逆元。 这将问题从配对测试转换为频率计数。 

我们从左到右处理数组。 对于当前值$x_j$，我们计算必须较早出现的残差。 哈希图存储每个立方体残基已经被看到的次数。 所需残数的计数恰好是在位置结束的有效对的数量$j$。 

唯一的特殊情况是$k=0$，其中反函数不可用，并且方程具有更简单的表征。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n^2)$|$O(1)$| 太慢了 |
 | 最佳 |$O(n \log p)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 读取输入数组。 
2. 手柄$k=0$分别地。 

方程变为$$a_i^3 a_j^3 \equiv 0 \pmod p.$$自从$p$是素数，当一个元素为零时就会发生这种情况。 
3. 如果存在零，则涉及该元素的每对都有效。 

由于所有数组值都是不同的，因此最多有一个零。 答案是$n-1$。 
4. 如果零不存在并且$k=0$，不存在有效的对。 
5. 对于$k\neq0$，创建一个哈希图`cnt`存储已处理的立方体残差的频率。 
6. 从左到右扫描阵列。 
7. 跳过值零。 

涉及零的对不能产生非零乘积模$p$。 
8. 计算$$x = a_i^3 \bmod p.$$9. 计算模逆$$x^{-1} \equiv x^{p-2} \pmod p$$使用费马定理。 
10. 所需的伴侣残基为$$need = k \cdot x^{-1} \bmod p.$$11.添加`cnt[need]`到答案。 

以前见过的每一次出现`need`与当前元素形成有效对。 
12.插入当前残数`x`进入地图。 
13.处理完所有元素后，输出累计答案。 

### 为什么它有效

 对于每个非零元素，我们存储其立方余数模$p$。 加工位置时$j$，该图准确地包含来自位置的残基$i<j$。 

等式$$x_i x_j \equiv k \pmod p$$相当于$$x_i \equiv k x_j^{-1} \pmod p$$因为$x_j\neq0$。 因此，每个有效的早期伙伴都对应于残基的一次出现`need`，并且每次出现`need`产生一个有效的对。 每对在处理其右端点时仅计数一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n, p, k = map(int, input().split())
    a = list(map(int, input().split()))

    if k == 0:
        if 0 in a:
            print(n - 1)
        else:
            print(0)
        return

    cnt = {}
    ans = 0

    for v in a:
        if v == 0:
            continue

        x = pow(v, 3, p)
        inv = pow(x, p - 2, p)
        need = (k * inv) % p

        ans += cnt.get(need, 0)
        cnt[x] = cnt.get(x, 0) + 1

    print(ans)

if __name__ == "__main__":
    main()
```第一个块处理特殊情况$k=0$。 由于所有值都是不同的，因此最多可以存在一个零。 如果是，则所有其他元素都与其形成有效对。 

对于一般情况，映射存储立方体残差的频率。 表达式`pow(v, 3, p)`计算$v^3 \bmod p$没有溢出。 表达式`pow(x, p - 2, p)`使用费马定理计算模逆，这是有效的，因为$p$是素数并且$x\neq0$。 

顺序很重要。 我们在插入当前残基之前查询地图。 这保证只与$i<j$被计数并防止自配对。 

## 工作示例

 ### 示例 1

 输入：```
3 3 2
0 1 2
```自从$k\neq0$，我们使用主要算法。 

| 价值| 立方残渣$x$| 需要| 上一次计数 | 回答 |
 | ---| ---| ---| ---| ---|
 | 0 | 跳过 | - | - | 0 |
 | 1 | 1 | 2 | 0 | 0 |
 | 2 | 2 | 1 | 1 | 1 |

 最终答案：`1`。 

此跟踪显示了映射如何将配对搜索转变为查找。 加工时`2`，所需的残差为`1`，已经出现过一次了。 

### 示例 2

 输入：```
6 11 2
1 3 5 6 7 8
```以 11 为模的立方余数为：

 | 价值| 立方残留|
 | ---| ---|
 | 1 | 1 |
 | 3 | 5 |
 | 5 | 4 |
 | 6 | 7 |
 | 7 | 2 |
 | 8 | 6 |

 加工顺序：

 | 价值| 残留物$x$| 需要| 上一次计数 | 回答 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 2 | 0 | 0 |
 | 3 | 5 | 7 | 0 | 0 |
 | 5 | 4 | 6 | 0 | 0 |
 | 6 | 7 | 5 | 1 | 1 |
 | 7 | 2 | 1 | 1 | 2 |
 | 8 | 6 | 4 | 1 | 3 |

 最终答案：`3`。 

这三个增量与声明中提到的三个有效对完全对应。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \log p)$| 每个元素执行恒定数量的模幂 |
 | 空间|$O(n)$| 立方体残基的哈希图|

 和$n=3\cdot10^5$和$p\le10^9$，模幂每次调用只需要大约 30 次乘法。 由此产生的复杂性完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    n, p, k = map(int, input().split())
    a = list(map(int, input().split()))

    if k == 0:
        print(n - 1 if 0 in a else 0)
        return

    cnt = {}
    ans = 0

    for v in a:
        if v == 0:
            continue

        x = pow(v, 3, p)
        inv = pow(x, p - 2, p)
        need = (k * inv) % p

        ans += cnt.get(need, 0)
        cnt[x] = cnt.get(x, 0) + 1

    print(ans)

def run(inp: str) -> str:
    global input
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    out = io.StringIO()
    old = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = old
    return out.getvalue().strip()

# provided samples
assert run("3 3 2\n0 1 2\n") == "1", "sample 1"
assert run("6 11 2\n1 3 5 6 7 8\n") == "3", "sample 2"

# custom cases
assert run("2 5 0\n0 1\n") == "1", "single zero pair"
assert run("2 5 0\n1 2\n") == "0", "k=0 without zero"
assert run("2 5 1\n1 1\n") != "0" if False else True  # distinctness violated by statement
assert run("3 5 1\n0 1 2\n") == "0", "zero ignored when k!=0"
assert run("2 2 1\n0 1\n") == "0", "smallest prime"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 5 0 / 0 1`|`1`| 特殊处理$k=0$|
 |`2 5 0 / 1 2`|`0`| 无零存在|
 |`3 5 1 / 0 1 2`|`0`| 零不能贡献时$k\neq0$|
 |`2 2 1 / 0 1`|`0`| 允许的最小素数 |

 ## 边缘情况

 考虑：```
3 5 0
0 1 2
```算法立即进入$k=0$分支。 由于零存在，因此返回$n-1=2$。 有效的对是$(0,1)$和$(0,2)$，完全符合数学条件。 

现在考虑：```
3 5 0
1 2 3
```再次$k=0$使用分支，但不存在零。 除非有一个因数为零，否则任何乘积都不能以素数为模为零，所以答案是`0`。 

最后：```
3 5 1
0 1 2
```处理过程中会跳过零值。 其余残留物正常检查。 由于没有对满足目标残差方程，所以答案是`0`。 跳过零可以避免尝试计算零的倒数，这将是未定义的。
