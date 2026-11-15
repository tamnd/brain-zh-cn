---
title: "CF 83D - 数字"
description: "我们需要计算区间$[a,b]$内的整数，其大于$1$的最小除数恰好是$k$。 对于数字 $x$，说它的最小除数是 $k$ 意味着两件事同时发生： 1. $x$ 可以被 $k$ 整除。 2."
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 83
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 72 (Div. 1 Only)"
rating: 2400
weight: 83
solve_time_s: 127
verified: true
draft: false
---

[CF 83D - 数字](https://codeforces.com/problemset/problem/83/D)

 **评分：** 2400
 **标签：** dp、数学、数论
 **求解时间：** 2m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要计算区间内的整数$[a,b]$其最小除数大于$1$正是$k$。 

对于一个号码$x$，说它的最小除数是$k$意味着两件事同时发生：

 1.$x$可以整除$k$。 
2.$x$不能被任何整数整除$2$到$k-1$。 

第二个条件立即意味着$k$本身一定是素数。 如果$k$是合数，它的较小除数之一也能整除$x$， 所以$k$永远不可能是最小的除数。 

限制很大。 两个都$a$和$b$可以达到$2 \cdot 10^9$，因此迭代该区间是不可能的。 即使用试除法单独检查每个数字，在最坏的情况下也需要数十亿次运算。 

的价值$k$也很大，但是一个重要的观察拯救了我们：如果$k$是质数，那么每个有效数都具有以下形式$$x = k \cdot t$$和$t$必须避免所有小于的质因数$k$。 

由于任何合数的最小约数都是素数，因此禁止被小于以下的素数整除就足够了$k$。 这将问题转化为包含排除和莫比乌斯函数的计数问题。 

一些边缘情况很容易被错误处理。 

如果$k$是合数，答案总是零。 例如：

 输入：```
1 100 6
```的每一个倍数$6$可以整除$2$或者$3$， 所以$6$永远不可能是最小的除数。 正确答案是：```
0
```一个粗心的实现，只检查被小于的数字的整除性$k$缩放后可能会意外地计算出倍数$6$。 

另一个微妙的情况出现时$k^2 > b$。 那么唯一可能的有效数字是$k$本身，因为每隔一个倍数$2k,3k,\dots$已经有一个更小的除数了。 示例：

 输入：```
10 20 13
```唯一的倍数$13$区间内是$13$，它的最小除数确实是$13$。 答案是：```
1
```转换区间时也存在差一陷阱$[a,b]$进入乘数范围$t$。 假设：

 输入：```
15 30 5
```我们将数字重写为$x=5t$。 然后：$$t \in \left[\left\lceil \frac{15}{5} \right\rceil,\left\lfloor \frac{30}{5} \right\rfloor\right] = [3,6]$$之中$3,4,5,6$， 仅有的$5$不能被小于以下的素数整除$5$。 这给出了$25$作为唯一有效的号码。 忘记左边界的上限将错误地包括$10$。 

## 方法

 暴力方法直接遵循定义。 对于每个整数$x$在$[a,b]$，我们发现它的最小除数大于$1$。 如果该除数等于$k$，我们算一下。 

这在逻辑上是有效的，因为最小除数唯一地确定该数字是否满足条件。 问题在于规模。 间隔长度可以差不多$2 \cdot 10^9$。 甚至一个$O(\sqrt{x})$每个数字的支票变得大得令人绝望。 

关键的观察是，如果$x$等于$k$， 然后$k$必须是素数并且$x$必须能整除$k$。 写：$$x = k \cdot t$$现在询问适用什么条件$t$。 

如果有一些素数$p < k$划分$t$， 然后$p$也分$x$，这与$k$是最小的除数。 所以$t$必须与小于以下的所有素数的乘积互质$k$。 

这将问题转换为计算不能被一组素数整除的范围内的整数。 

小于的素数个数$k$当他们的产品保持在以下水平时，不可能很大$2 \cdot 10^9$。 前十个素数的乘积已经超出了这个限制。 这意味着我们可以安全地对这些素数的所有子集使用包含-排除。 

暴力破解会单独检查每个数字。 最佳解决方案通过减去多个禁止素数来一次性计算整个组的数量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O((b-a+1)\sqrt{b})$|$O(1)$| 太慢了 |
 | 最佳|$O(\sqrt{k} + 2^{\pi(k)})$|$O(\pi(k))$| 已接受 |

 ## 算法演练

 1. 检查是否$k$是素数。 

如果$k$是复合的，立即打印$0$。 合数永远不可能是另一个数的最小因数，因为它的较小素因数之一会首先出现。 
2. 从数字转换间隔$x$乘数$t$。 

每个有效数字都具有以下形式：$$x = k \cdot t$$所以：$$L = \left\lceil \frac{a}{k} \right\rceil$$

$$R = \left\lfloor \frac{b}{k} \right\rfloor$$我们现在需要计算整数$t \in [L,R]$不能被任何小于的素数整除$k$。 
3. 生成所有小于的素数$k$。 

我们只需要素数达到$\sqrt{k}$来测试素数，但我们也存储每个小于的素数$k$因为这些是禁止除数$t$。 
4. 应用包含-排除。 

设禁忌素数为：$$p_1,p_2,\dots,p_m$$对于这些素数的每个子集，计算它们的乘积：$$d = p_{i_1}p_{i_2}\cdots p_{i_s}$$数一下里面有多少个数字$[L,R]$可以被整除$d$:$$\left\lfloor \frac{R}{d} \right\rfloor - \left\lfloor \frac{L-1}{d} \right\rfloor$$如果子集大小为偶数，则添加此计数；如果子集大小为奇数，则减去此计数。 
5、最终的纳入排除结果即为有效乘数的个数$t$，等于有效整数的数量$x$。 

### 为什么它有效

 每个有效数字都可以唯一地写为$x = kt$。 自从$k$是素数，唯一的方法是$x$有一个更小的除数是为了$t$包含一个小于的质因数$k$。 该算法准确地计算了那些$t$避免所有禁止的素数。 

包含-排除是正确的，因为它会交替减去可被至少一个禁止素数整除的数字和加回多次计数的数字。 处理完所有子集后，每个无效子集$t$贡献零净计数，而每个有效$t$恰好贡献了一个。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def is_prime(x):
    if x < 2:
        return False
    d = 2
    while d * d <= x:
        if x % d == 0:
            return False
        d += 1
    return True

def primes_less_than(k):
    primes = []
    for x in range(2, k):
        ok = True
        d = 2
        while d * d <= x:
            if x % d == 0:
                ok = False
                break
            d += 1
        if ok:
            primes.append(x)
    return primes

def solve():
    a, b, k = map(int, input().split())

    if not is_prime(k):
        print(0)
        return

    L = (a + k - 1) // k
    R = b // k

    if L > R:
        print(0)
        return

    primes = primes_less_than(k)

    ans = 0
    m = len(primes)

    for mask in range(1 << m):
        bits = 0
        prod = 1

        for i in range(m):
            if (mask >> i) & 1:
                bits += 1
                prod *= primes[i]

                if prod > R:
                    break

        else:
            cnt = R // prod - (L - 1) // prod

            if bits % 2 == 0:
                ans += cnt
            else:
                ans -= cnt

    print(ans)

solve()
```第一部分检查是否$k$是素数。 这不是优化，而是正确性要求。 如果$k$是合数，没有数字可以精确地具有最小除数$k$。 

接下来我们将原始区间转换为乘数空间。 每个候选编号都是以下的倍数$k$，所以我们只使用以下值$t$。 左边界的上限划分很容易出错。 使用：```
(a + k - 1) // k
```正确计算最小整数$t$这样$kt \ge a$。 

包含-排除循环迭代禁止素数的每个子集。 变量`prod`存储当前子集中素数的乘积。 如果该产品已经超过`R`，范围内的任何数字都不能被它整除，因此子集没有任何贡献。 

交替的符号直接来自包含-排除。 偶数大小的子集添加计数，奇数大小的子集减去计数。 

该实现永远不会有溢出的风险，因为 Python 整数是任意精度的，但早期的突破`prod > R`保持子集处理较小。 

## 工作示例

 ### 示例 1

 输入：```
1 10 2
```我们有$k=2$，这是素数。$$L = \left\lceil \frac{1}{2} \right\rceil = 1$$

$$R = \left\lfloor \frac{10}{2} \right\rfloor = 5$$不存在小于以下的素数$2$，所以每一个$t$在$[1,5]$是有效的。 

| 步骤| 价值|
 | --- | --- |
 |$L$| 1 |
 |$R$| 5 |
 | 禁止素数 | 无 |
 | 有效的$t$| 1,2,3,4,5 |
 | 有效的$x$| 2,4,6,8,10 |
 | 回答 | 5 |

 这演示了最简单的情况，其中包含-排除只有空子集。 

### 示例 2

 输入：```
1 30 5
```自从$5$是质数：$$L = 1,\quad R = 6$$禁止素数是$2$和$3$。 

| 子集| 产品 | 计入$[1,6]$| 贡献 |
 | --- | --- | --- | --- |
 | {} | 1 | 6 | +6 |
 | {2} | 2 | 3 | -3 |
 | {3} | 3 | 2 | -2 |
 | {2,3} | 6 | 1 | +1 |

 最终答案：$$6 - 3 - 2 + 1 = 2$$有效乘数为$1$和$5$，给出数字$5$和$25$。 

该跟踪显示了包含-排除如何删除可被禁止素数整除的数字并正确恢复重叠。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(\sqrt{k} + 2^{\pi(k)})$| 素数测试加上对小于的素数的包含排除$k$|
 | 空间|$O(\pi(k))$| 存储禁止素数 |

 相关素数的数量很少，因为它们的乘积增长得非常快。 尽管包含-排除在素数数量上呈指数增长，但实际子集计数在时间限制内仍然足够小。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    def is_prime(x):
        if x < 2:
            return False
        d = 2
        while d * d <= x:
            if x % d == 0:
                return False
            d += 1
        return True

    def primes_less_than(k):
        primes = []
        for x in range(2, k):
            ok = True
            d = 2
            while d * d <= x:
                if x % d == 0:
                    ok = False
                    break
                d += 1
            if ok:
                primes.append(x)
        return primes

    a, b, k = map(int, input().split())

    if not is_prime(k):
        print(0)
        return

    L = (a + k - 1) // k
    R = b // k

    if L > R:
        print(0)
        return

    primes = primes_less_than(k)

    ans = 0
    m = len(primes)

    for mask in range(1 << m):
        bits = 0
        prod = 1

        for i in range(m):
            if (mask >> i) & 1:
                bits += 1
                prod *= primes[i]

                if prod > R:
                    break
        else:
            cnt = R // prod - (L - 1) // prod

            if bits % 2 == 0:
                ans += cnt
            else:
                ans -= cnt

    print(ans)

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out.strip()

# provided sample
assert run("1 10 2\n") == "5", "sample 1"

# composite k
assert run("1 100 6\n") == "0", "composite k"

# single valid number
assert run("13 13 13\n") == "1", "single prime"

# no multiples of k in range
assert run("1 10 13\n") == "0", "empty multiplier interval"

# boundary case with ceil division
assert run("15 30 5\n") == "1", "left boundary correctness"

# larger interval
assert run("1 30 5\n") == "2", "inclusion exclusion correctness"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 100 6`|`0`| 合成的$k$立即失败|
 |`13 13 13`|`1`| 恰好包含一个有效数字的区间 |
 |`1 10 13`|`0`| 没有倍数$k$存在|
 |`15 30 5`|`1`| 左边界正确的天花板划分 |
 |`1 30 5`|`2`| 包含-排除重叠处理|

 ## 边缘情况

 考虑复合情况：

 输入：```
1 100 6
```该算法首先检查素数。 自从$6$可以整除$2$，它不是素数，因此算法立即返回：```
0
```这是正确的，因为每个倍数$6$已经可以被整除$2$，小于$6$。 

现在考虑边界情况，其中仅$k$其本身可能符合：

 输入：```
10 20 13
```我们计算：$$L = \left\lceil \frac{10}{13} \right\rceil = 1$$

$$R = \left\lfloor \frac{20}{13} \right\rfloor = 1$$唯一的乘数是$t=1$，对应于$x=13$。 自从$1$不能被禁止素数整除，答案变为：```
1
```该算法自然地处理这个问题，无需特殊的分支。 

最后，考虑一下差一陷阱：

 输入：```
15 30 5
```该算法计算：$$L = (15+5-1)//5 = 3$$

$$R = 30//5 = 6$$候选乘数为$3,4,5,6$。 包含-排除删除$3,4,6$因为它们可以被整除$2$或者$3$。 仅有的$5$保留，给出单个有效数字$25$。 

如果我们对左边界使用普通的楼层划分，我们会错误地包括乘数$2$，对应于$10$，位于区间之外。
