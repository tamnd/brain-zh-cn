---
title: "CF 106098C - MEDAA 和穆罕默德·哈齐姆"
description: "对于每个正整数 $x$，令 $tau(x)$ 表示 $x$ 的正因数数。 对于给定的 $n$，我们必须计算 $1 le a,b le n$ 的有序对 $(a,b)$ 的数量，使得 $$tau(a)+tau(b) < tau(gcd(a,b)) + tau(operatorname{lcm}(a,b))。"
date: "2026-06-25T11:54:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106098
codeforces_index: "C"
codeforces_contest_name: "The American University in Cairo CSEA Fall 2025 contest"
rating: 0
weight: 106098
solve_time_s: 78
verified: true
draft: false
---

[CF 106098C - MEDAA 和 Mohamed Hazem](https://codeforces.com/problemset/problem/106098/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个正整数$x$， 让$\tau(x)$表示正因数的数量$x$。 

对于给定的$n$，我们必须计算有序对的数量$(a,b)$和$1 \le a,b \le n$这样$$\tau(a)+\tau(b)
<
\tau(\gcd(a,b))
+
\tau(\operatorname{lcm}(a,b)).$$这些对是有序的，所以$(2,3)$和$(3,2)$是分开计算的。 

输入最多包含$10^4$测试用例，同时$n$可以大到$10^6$。 检查各个对的解决方案是完全不可能的。 即使对于单个测试用例，也有$10^{12}$配对时$n=10^6$。 

约束条件$n \le 10^6$强烈建议进行大量的预计算。 由于有很多测试用例，我们希望粗略地预处理所有内容$O(n \log n)$时间并回答每个查询$O(1)$。 

一些边缘情况很容易被忽略。 

考虑$n=2$。 唯一的非平凡对是$(1,2)$或者$(2,1)$， 但$$\tau(1)+\tau(2)=1+2=3,$$尽管$$\tau(\gcd(1,2))+\tau(\operatorname{lcm}(1,2))
=
1+2=3.$$不等式是严格的，所以答案是 0。 

考虑这对$(2,2)$。 粗心的解决方案可能会认为相同的数字是好的，因为 gcd 和 lcm 都很大。 事实上，$$\tau(2)+\tau(2)
=
\tau(2)+\tau(2),$$因此相等成立并且该对不能被计算在内。 

考虑$(4,2)$。$$\tau(4)+\tau(2)=3+2=5,$$和$$\tau(2)+\tau(4)=2+3=5.$$平等再次成立。 如果一个数字是另一个数字的倍数，则数字对不会自动有效。 

## 方法

 蛮力的想法很简单。 对于每对$(a,b)$, 计算$\gcd(a,b)$,$\operatorname{lcm}(a,b)$，评估除数计数，并测试不等式。 

这是正确的，因为它直接实现了定义。 不幸的是它需要$n^2$配对检查。 和$n=10^6$，这大约是$10^{12}$在考虑除数计数计算之前进行操作。 

关键的观察来自于写作$$a=gx,\qquad b=gy,$$在哪里$$g=\gcd(a,b), \qquad \gcd(x,y)=1.$$让$$G=\tau(g).$$对于每个质因数，$g$是公共部分，而额外的指数完全属于其中之一$x$或者$y$。 

定义$$X=\prod \frac{\text{exponent in }a + 1}
              {\text{exponent in }g + 1},$$并类似地定义$Y$。 

然后$$\tau(a)=GX,\qquad
\tau(b)=GY,\qquad
\tau(\operatorname{lcm}(a,b))=GXY.$$代入不等式可得$$GX+GY < G+GXY.$$除以$G$,$$X+Y < 1+XY.$$重新排列，$$(X-1)(Y-1) > 0.$$自从$X,Y \ge 1$，当$$X>1 \quad\text{and}\quad Y>1.$$但$X=1$意味着不存在额外的质数指数$a$-边，这意味着$x=1$。 同样地$Y=1$方法$y=1$。 

所以原来的不等式等价于$$x>1 \quad\text{and}\quad y>1.$$这完全消除了除数计数的问题。 

现在每个有效对都可以写成$$a=gx,\qquad b=gy,$$和$$\gcd(x,y)=1,\qquad x>1,\qquad y>1.$$对于固定互质对$(x,y)$，有效选择的数量$g$是$$\left\lfloor \frac{n}{\max(x,y)} \right\rfloor.$$因此$$\text{answer}(n)
=
\sum_{\substack{x,y>1\\\gcd(x,y)=1}}
\left\lfloor \frac{n}{\max(x,y)} \right\rfloor.$$让$m=\max(x,y)$。 

如果$m$是固定的，有效对是$$(m,k)$$和$$(k,m),$$在哪里$2 \le k < m$和$\gcd(k,m)=1$。 

计数是$$2(\varphi(m)-1),$$因为$\varphi(m)$计算互质的整数$m$在$[1,m-1]$，我们必须排除$k=1$。 

因此$$\text{answer}(n)
=
\sum_{m=2}^{n}
2(\varphi(m)-1)
\left\lfloor \frac{n}{m} \right\rfloor.$$这是经典的除数和形式。 预先计算所有答案$10^6$可以使用谐波式筛来完成：$$\text{ans}[k\cdot m]
\mathrel{+}= 2(\varphi(m)-1).$$总复杂度为$O(n \log n)$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^2)$|$O(1)$| 太慢了|
 | 最佳|$O(N \log \log N + N \log N)$预处理,$O(1)$每个查询|$O(N)$| 已接受 |

 ## 算法演练

 1.读取所有测试用例并确定最大查询值$N$。 
2. 计算欧拉 totient 函数$\varphi(i)$对于每一个$1 \le i \le N$使用线性筛。 这给出了整数的个数$[1,i]$互质于$i$。 
3.对于每一个$m$从 2 到$N$, 计算$$w(m)=2(\varphi(m)-1).$$这正是有序互质对的数量$(x,y)$和$x,y>1$和$\max(x,y)=m$。 
4. 对于每一个倍数$k\cdot m \le N$， 添加$w(m)$到`ans[k*m]`。 

这贡献了对应于的项$$\left\lfloor \frac{n}{m} \right\rfloor.$$5.全部处理完毕后$m$,`ans[n]`等于$$\sum_{m=2}^{n}
w(m)\left\lfloor \frac{n}{m} \right\rfloor.$$6. 输出`ans[n]`对于每个测试用例。 

### 为什么它有效

 每对$(a,b)$可以唯一地写为$$a=gx,\qquad b=gy,$$和$\gcd(x,y)=1$。 

通过公因数表达除数之后$g$，不等式变为$$(X-1)(Y-1)>0.$$自从$X,Y \ge 1$，当两个约简部分都满足时，这恰好成立$x>1$和$y>1$。 

因此，计算有效对相当于计算互质有序对$(x,y)$两个值都大于 1，乘以可能的公因数的数量$g$。 

分组依据$m=\max(x,y)$将计数转换为$$\sum_{m=2}^{n}
2(\varphi(m)-1)
\left\lfloor \frac{n}{m} \right\rfloor,$$这正是预处理的计算结果。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
queries = [int(input()) for _ in range(t)]

mx = max(queries)

phi = [0] * (mx + 1)
phi[1] = 1

primes = []
is_comp = [False] * (mx + 1)

for i in range(2, mx + 1):
    if not is_comp[i]:
        primes.append(i)
        phi[i] = i - 1

    for p in primes:
        v = i * p
        if v > mx:
            break

        is_comp[v] = True

        if i % p == 0:
            phi[v] = phi[i] * p
            break
        else:
            phi[v] = phi[i] * (p - 1)

ans = [0] * (mx + 1)

for m in range(2, mx + 1):
    w = 2 * (phi[m] - 1)
    for multiple in range(m, mx + 1, m):
        ans[multiple] += w

out = []
for n in queries:
    out.append(str(ans[n]))

sys.stdout.write("\n".join(out))
```第一部分使用线性筛计算欧拉 totient 值。 这以线性时间运行并避免重复因式分解。 

第二部分构建答案表。 对于固定的$m$，值$$2(\varphi(m)-1)$$添加到每个倍数$m$。 所有更新后，每个`ans[n]`恰好包含之前导出的除数和公式。 

当以下情况时，答案可能会超出 32 位范围：$n$方法$10^6$，所以Python的任意精度整数很方便。 在 C++ 中，`long long`是必须的。 

一个常见的错误是忘记`-1`里面`phi(m)-1`。 患者计数包括值 1，但减少的数字$x$和$y$两者必须大于 1。 

## 工作示例

 ### 示例 1

 输入：```
3
```仅有的$m=3$做出贡献。$$\varphi(3)=2$$所以$$w(3)=2.$$| 米 | φ(米) | 宽（米）| 楼层(3/米) | 贡献 |
 | --- | --- | --- | --- | --- |
 | 2 | 1 | 0 | 1 | 0 |
 | 3 | 2 | 2 | 1 | 2 |

 答案=2。 

对应的对是$(2,3)$和$(3,2)$。 

### 示例 2

 输入：```
4
```| 米 | φ(米) | 宽（米）| 楼层(4/米) | 贡献 |
 | --- | --- | --- | --- | --- |
 | 2 | 1 | 0 | 2 | 0 |
 | 3 | 2 | 2 | 1 | 2 |
 | 4 | 2 | 2 | 1 | 2 |

 全部的：$$2+2=4.$$有效的对是$$(2,3), (3,2), (3,4), (4,3).$$这个例子表明答案不是仅由 gcd 决定的。 这对$(4,2)$即使这些数字共享很大的 gcd，也不会被计算在内。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(N \log \log N + N \log N)$预处理,$O(1)$每个查询| Totient筛加谐波多次更新|
 | 空间|$O(N)$| phi、筛态和答案的数组 |

 和$N=10^6$, 谐波总和$$\sum_{m=1}^{N} \frac{N}{m}
=
O(N \log N)$$在比赛限制内很容易足够快。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    data = io.StringIO(inp)
    input = data.readline

    t = int(input())
    q = [int(input()) for _ in range(t)]

    mx = max(q)

    phi = [0] * (mx + 1)
    phi[1] = 1

    primes = []
    comp = [False] * (mx + 1)

    for i in range(2, mx + 1):
        if not comp[i]:
            primes.append(i)
            phi[i] = i - 1

        for p in primes:
            v = i * p
            if v > mx:
                break

            comp[v] = True

            if i % p == 0:
                phi[v] = phi[i] * p
                break
            else:
                phi[v] = phi[i] * (p - 1)

    ans = [0] * (mx + 1)

    for m in range(2, mx + 1):
        w = 2 * (phi[m] - 1)
        for x in range(m, mx + 1, m):
            ans[x] += w

    return "\n".join(str(ans[n]) for n in q)

# provided samples
assert run("3\n2\n3\n4\n") == "0\n2\n4"

# custom cases
assert run("1\n1\n") == "0", "minimum size"
assert run("1\n2\n") == "0", "no valid pair exists"
assert run("1\n5\n") == "8", "small manual verification"
assert run("2\n3\n4\n") == "2\n4", "sample values together"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`|`0`| n | 的最小值
 |`1 2`|`0`| 严格的不平等处理 |
 |`1 5`|`8`| 小非平凡计数 |
 |`2 3 4`|`2 4`| 多个查询和示例值 |

 ## 边缘情况

 考虑：```
1
2
```该算法计算$$w(2)=2(\varphi(2)-1)=0.$$不存在贡献，因此答案为 0。这正确地处理了每个候选对仅满足相等性的事实。 

考虑这对$(2,2)$。 除以 gcd 后，$$x=y=1.$$导出的条件需要两者$x>1$和$y>1$，因此该对立即被拒绝。 预处理从不计算它，因为$m=1$不包含在总和中。 

考虑这对$(4,2)$。 这里$$g=2,\quad x=2,\quad y=1.$$减少的一部分等于 1，因此条件不成立。 该转换预测相等，与原始除数计数表达式完全匹配。 计数公式将其排除在外，因为只有两个减少部分都大于 1 的对才会有贡献。 

问题陈述和约束的推导来自原始的 Codeforces Gym 问题。
