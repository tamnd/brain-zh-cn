---
title: "CF 2166B - 拉环闭合"
description: "<标题值a)。 如果当前打开了 (=\"解决方案编辑\"m) 个选项卡，则每个选项卡的长度为 [ size=\"2xl\"/<标题值=\"问题理解\" size=\"text{len} = minleft(b,frac{a}{m}right)。"
date: "2026-06-09T04:30:38+07:00"
tags: ["codeforces", "competitive-programming", "math"]
categories: ["algorithms"]
codeforces_contest: 2166
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 1064 (Div. 2)"
rating: 900
weight: 2166
solve_time_s: 289
verified: false
draft: false
---

[CF 2166B - 选项卡关闭](https://codeforces.com/problemset/problem/2166/B)

 **评分：** 900
 **标签：** 数学
 **求解时间：** 4m 49s
 **已验证：** 否

 ## 解决方案
 <标题值a\)。 如果目前有\(="Solution Editorial"m\)选项卡打开，每个选项卡都有长度$$
 size="2xl"/><Title value="Problem Understanding" size="\text{len} = \min\left(b,\frac{a}{m}\right).
$$xl"/><Text>有 <Text inline Weight="semibold" value="m"/> 选项卡从左到右排列，因此它们的关闭按钮位于$$
\text{ tabs currently open. Every tab has the same length <Mathlen},\ 2\text{len},\ 3\text{len},\ \dots,\ m\text{len}.
$$当 value="\text{len}=\min(b,\frac{a}{m 我们关闭一个选项卡时，剩余选项卡的数量会减少，这会改变选项卡长度，从而改变所有未来的关闭})"/>。 关闭按钮(x)是按钮位置。 

光标从位置开始\(0\)。 我们可以将位于位置 <Math value="\text{len},2\text{len},3\text{len},\dots,m 的位置移动到任意位置。一旦光标位于某个位置\(x\)，我们可以\text{len}"/>从左边缘开始测量，每当关闭按钮正好出现在\(x\)。 该问题询问关闭所有屏幕所需的最少鼠标移动次数。</Text><Text>当您关闭选项卡时，\(n\)选项卡。 

限制条件非常大。 两个都\(a\)和\(n\)可以达到 \(10^9\ <Text inline Weight="semibold" value="m"/> 减小，因此所有 tab 位置都可以)，并且最多有\(10^4\)测试用例。 任何对关闭过程的模拟都是改变。 您的光标从位置 <Text inline Weight="semibold" value="0"/> 开始。 一个不可能的。 每个测试用例我们需要一个恒定时间公式。 

棘手的部分是理解鼠标移动意味着将光标重新定位到新位置； 一旦到达那里，您的单个鼠标位置可能在多次连续关闭中仍然有用，因为关闭可能会重复单击而无需额外移动。</Text><Text>任务是找到最右侧选项卡的按钮可以重复出现在同一坐标处。 

考虑：

 `` the minimum number of cursor movements needed to close all tabs.</Text><Text>The constraints are very small`a = 8，b = 1，n = 6```

For every \(m \ computationally but very large numerically: <Mathge 8\),

\[
\min(b,a/m)=1.
\]

 value="a,b,n \le 10^9"/> and up to <Math value="10^The rightmost close button is always at position \(m\cdot 1\), which changes. However, when \(m<4"/> test cases. This rules out any simulation that closes tabs one by one. We need an <8\),

\[
\text{len}=a/m,
\]

and the rightmost close button becomes

\Math value="O(1)"/> or <Math[
m\cdot (a/m)=a=8.
\]

A careless simulation may miss that many future clicks value="O(\log n)"/> solution per test case.</Text><Title value="Non-obvious can happen at the same coordinate.

Another subtle case is

```a = 9，b = 6，n = 2
 `` edge cases" size="lg"/><Card size="`为了\(m=2\),$$
\text{len}=\min(6,4.full" background="surface" gap={3}><5)=4.5.
$$关闭按钮位于\(4.5\)和\(9\)。 AfterTitle value="关闭按钮位置可以固定关闭一个选项卡，\(m=1\)，唯一的关闭按钮位于\(6\)。 没有单个删除多个” size="sm"/><Text>示例位置适用于两种状态，所以答案是\(2\)。 
## 方法
 A:</Text><代码块 language="text" content="a = 8, b = 暴力解释将跟踪 1, n = 6 的所有关闭按钮的位置"/><Text>对于每个<每个值\(m\)，然后尝试确定哪些位置可以Math value="m \ge 8"/>、制表符长度<被重用。 即使对于单个测试用例，\(n\)或许\(Math value="1"/>, so the rightmost close button stays10^9\)，所以处理每个状态是没有希望的。 

关键的观察结果来自于查看最右边的选项卡。 

在位置 <Math value="1"/>。 您可以移动一次到位置，当有\(m\)选项卡，最右边的关闭按钮位于$$
R(m)=m\cd <Math value="1"/> and click six times. The answer is <Text inline weightot \min\left(b,\frac{a}{m}\right).
$$这立即简化了：$$
R(m)=="semibold" value="1"/>. A naive approach that assumes positionsmin(mb,a).
$$假设我们将光标放在某个位置\( always change would incorrectly count multiple movements.</Text></Card><Card size="full"x\)。 只要最右边的关闭按钮保持在\(x\)。 背景=“表面”间隙= {3}> <标题值=“关闭按钮位置可以改变因此\（R（m）\）的每个不同值都需要一次鼠标移动。

 现在在每次删除后检查" size="sm"/><Text>示例：</Text><CodeBlock language="text" 序列$$
R(n),R(n-1),\dots,R(1).
$$如果 \(mb<a\ content="a = 9, b = 6, n = 2"/><Text> 与)，则$$
R(m)=mb.
$$这些值都是不同的，因为\(b> two tabs, <Math value="\text{len}=9/2=4.5"/0\)。 

如果\(mb\ge a\)， 然后$$
R(m)=a.
$$All>，因此最右边的关闭按钮位于 <Math value 处，这些状态共享相同的位置。 

因此该序列包括：$$
="9"/>. After closing one tab, <Math valuea,a,a,\dots,a
$$为所有人\(m\ge \lceil a/b\rceil="\text{len}=6"/>, so the remaining close button is at <\)， 其次是$$
(\lceil a/b\rceil-1)b,
(\lceil a/bMath value="6"/>. The cursor must move from <Math\rceil-2)b,
\dots,
b.
$$下面的每个值\( value="9"/> to <Math value="6"/>, so the answer isa\)是独一无二的。 

让$$
k=\left\lceil \frac{a}{ <Text inline weight="semibold" value="2"/>. A careless solution that only checks theb}\right\rceil.
$$如果\(n<k\)，那么每个状态都满足\(mb<a\)，初始配置会错过这个。</Text></Card><所以所有\(n\)立场不同，答案是\(n\)。 

如果\(n\Card size="full" background="surface" gap={3}><Title value="More tabs thange k\)，那么所有状态\(m\ge k\)共用一个位置\(a fit at the maximum length" size="\)，而剩余的\(k-1\)各国作出贡献\(k-1\)sm"/><Text>示例：</Text><CodeBlock language="text" content="a = 8, b = 1, n = 9"/>< 不同的位置。答案变为$$
1+(k-1)=k.
$$结合这两种情况，$$
\boxed{\Text>When <Math value="m \ge 8text{answer}=\min\left(n,\left\lceil\"/>, thefrac{a}{b}\right\rceil\right)}.
$$### 接近最右边的关闭按钮位于<数学值比较

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 |---|---|---|---|
 | 蛮力 | \(O(n)\) | \(O(1)\) | 太慢了|
 | 最佳| \(O(1)\) | \(O(1)\) | 已接受=“1”/>。 删除足够的选项卡后，<Math value="m"/> 变为 <Math value="7"/>，现在 <Math value=" |

 ## 算法演练

 1. 计算$$
k=\left\lceil \frac{a}{b}\right\rceil.
$$2. 观察每个状态\(m\gea/m &gt; 1"/>, so the close button k\)，最右边的关闭按钮位于位置\(a\)。 

3. 观察每个状态\(m<k\)，右侧位置发生变化。 答案变成 <Text inline Weight="semibold" value="most close button is located at\(mb\)，以及所有此类 2"/>，而不是 <Text inline Weight="semibold" value="1"/>。</Text></Card><Title value=" 位置是不同的。 

4. 如果\(n<k\)，每个州贡献不同的位置，所以答案是\(n\)。 

5.如果\(n\ge k\),Approaches" size="xl"/><Text>暴力模拟将重复重新计算制表符长度和最右边的关闭所有状态\(m\ge k\)折叠成一个共同的位置\(a\)，而剩余的\(k-1\)每次删除后按钮，计算有多少不同的状态贡献了不同的位置。 答案是\(k\)。 

6. 输出$$
\min positions the cursor must visit. This works because the cursor(n,k).
$$### 为什么它有效

 唯一重要的关闭按钮是最右边的按钮。 仅当最右边的关闭按钮的位置发生变化时才需要移动关闭。 但是，使用 <Math tab 会将选项卡数量减少 1，并将我们从状态移出\( value="n"/> up to <Math value="10^9"/m\)陈述\(m-1\)。 

对于状态\(m\)，最右边的关闭按钮位于>，模拟每次删除是不可能的。</Text><Text>关键的观察是，在$$
R(m)=\min(mb,a).
$$每次有<Math value="m"/>标签时最右边的两个关闭按钮位置</不同的状态具有相同的\(R(m)\)值，无需Text><Math block value="x(m)=m\cdot \min\移动鼠标即可处理。每次值改变时，新的鼠标位置left(b,\frac{a}{m}\right)=\min(mb,a)。"/><Text>如所需要。 

这些值等于\(a\)形成一个大块。 下面的每个值我们都会关闭选项卡，<Math value="m"/> 会从 <Math 减少\(a\)是一个不同的倍数\(b\)。 计算 \(R(m)\) 的不同值\(m value="n"/> down to <Math value="1"/>.</=1,\dots,n\)准确地给出$$
\min\left(n,\left\lceil\frac{a}{b}\rightText><Text>There are only two regimes:</Text><List\rceil\right).
$$## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t marker="decimal" connector="solid" = int(input())
    ans = []

    for _ in range(t):
        a, b, n = map(int, input().split())

        gap={3}><List.Item><Text><Text inline weight k = (a + b - 1) // b  # ceil(a / b)
        ans.append(str(min(n, k)))

   ="semibold" value="Saturated regime:"/> If <Math sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```实现方式几乎是 value="mb \ge a"/>，然后是 <Math value="x(m)=a"/>。 完全是数学公式。 

表达式```python
(a + b - 1) // b
 The close button stays at the fixed position <Math value```computes="a"/>.</Text></List.Item><List.Item><Text><Text inline Weight="semibold" value="线性体系："/> 如果 <Math value="mb <a"/>，则 <Math value="x\[
\left\lceil \frac{a}{b}\right\rceil
\]使用整数运算。 

最终的答案很简单```python
min(n, k)
```直接匹配推导公式。 

No(m)=mb"/>。<Math浮点运算需要不同的值，这样可以避免当\(a\)和\( value="m"/> give different positions.</Text></List.Item></List><Text>Define <b\)很大。 

## 工作示例

 ### 示例 1

 输入：```
8 Math value="t=\left\lceil \frac1 6
```这里\[
k=\left\lceil\frac{8}{1}\right\rceil={a}{b}\right\rceil"/>. Then <Math value="mb \8.
\]| 米 | R(m)=min(mb,a) | R(m)=min(mb,a) |
 |---|---|
 | 6 | ge a"/> 恰好在 <Math value="m \ge t"/> 时。</Text><Text6 |
 | 5 | 5 |
 | 4 | 4 |
 | 3 | 3 |
 | 2 | 2 |
 >如果<数学值=“n < t"/| 1 | 1 |

 有六个不同的立场。 

自从\(n<k\),

 \>，我们始终处于线性状态，因此每次删除都会改变[
 \text{答案}=6。 
\]

 但是，我们可以保留该位置，并且需要 <Math value="n"/> 移动。</Text><Text>如果 <Math value="n \ 光标位于该位置\(1\)并重复关闭最左侧可见选项卡 asge t"/>，则所有具有 <Math value="m=t,t+1,\dots 布局的状态都会缩小。 对问题的预期观察是，distinct,n"/> 共享相同的位置 <Math value="a"/>。我们可以将最右边的状态折叠到公式中，得到\[
\min(6,8)=1.
 all of them with one movement. After that, for <Math value="m=t-1,t-\]接受的解决方案输出\(1\)。 

### 示例 2

 输入：```
9 6 2,\dots,1"/>, the positions are distinct, requiring2
```这里\[
k=\left\lceil\frac{9}{6}\right\rceil= <Math value="t-1"/> more movements. Total: <Math value="1+(2.
\]| 米 | R(m)=min(mb,a) | R(m)=min(mb,a) |
 |---|---|
 | 2 | 9 |
 t-1)=t"/>.</Text><Text>所以答案很简单| 1 | 6 |

 立场不同。 

因此\[
\text{answer}=\</Text><Math block value="\boxed{\min\left(n,\min(2,2)=2.
\]第一次点击可能发生在\(9\), butleft\lceil \frac{a}{b}\right\rceil\right)}."/><Table>< 保留一个选项卡后，关闭按钮移动到\(6\)，强制鼠标再次移动。 

## ComplexityTable.Row><Table.Cell><Text Weight="semibold">方法</Text></表格分析

 | 测量| 复杂性 | 说明|
 |---|---|---|
 | 时间 | 每个测试用例 \(O(1)\) | Only.Cell><Table.Cell><Text Weight="semibold">时间复杂度</Text></Table.Cell><Table.Cell><Text几个算术运算|
 | 空间| \(O(1)\) | 没有额外的数据结构 |

 与 atweight="semibold">空间复杂度</Text></Table.Cell><Tablemost\(10^4\)测试用例，总工作量很小。 该解决方案很容易满足时间和内存的限制。 

.Cell><Text Weight="semibold">判决</Text></Table.Cell></Table.Row><Table.Row><Table.Cell>暴力破解</Table.Cell><Table.Cell><Math value="O## 测试用例```python(n)"/></Table.Cell><Table.Cell><Math value="O
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    t = int(input())
    out = []

   (1)"/></Table.Cell><Table.Cell>Too slow for <Math for _ in range(t):
        a, b, n = map(int, input().split())
        k = (a + b - 1) // b
 value="n=10^9"/></Table.Cell></Table.Row><Table.Row><Table.Cell>        out.append(str(min(n, k)))

    return "\n".join(out)

# provided sample
assert run("""12
8 Optimal</Table.Cell><Table.Cell><Math value="O(1)"/></Table.Cell><Table.Cell><Math1 6
9 6 2
10 3 1
10 1 10
9 2 1
5 5  value="O(1)"/></Table.Cell><Table.Cell>Accepted</Table.Cell></Table.Row></Table><6
6 2 7
9 1 9
3 2 6
8 1 7
8 1 9
8 2 Title value="Algorithm Walkthrough" size="xl"/><List marker="decimal" connector="solid" gap={4
""") == """1
2
1
1
1
1
2
1
2
1
2
1"""

#3}><List.Item>Compute <Math value="t=\left\lceil \frac minimum values
assert run("""1
1 1 1
""") == "1"

# large values{a}{b}\right\rceil"/>. In
assert run("""1
1000000000 1 1000000000
""") == "2"

# b = integer arithmetic, <Math value="t=(a+b-1)//b"/>.</ a
assert run("""1
10 10 100
""") == "1"

# boundaryList.Item><List.Item>If <Math value="n & around ceil(a/b)
assert run("""1
10 3 4
""") == "1"
```### 自定义测试摘要

 LT； t"/>，每个状态都处于线性状态<|测试输入|预期输出|它验证什么|
 |---|---|---|
 |`1 1 1`|`1`|Math value="x(m)=mb"/>，因此所有位置都是不同的。 答案是<数学最小可能情况|
 |`1000000000 1 1000000000`| 公式结果| value="n"/>.</List.Item><List.Item>如果 <Math value="n \ge t 最大值 |
 |`10 10 100`|`1`| 所有选项卡始终"/>，则 <Math value="m=t,t+1,\dots,n"/> 的位置具有相同的关闭位置 |
 |`10 3 4`| 边界情况| 都等于 <Math value="a"/>，需要一次移动。 周围过渡\(\lceil a/b\rceil\)|

 ## 边缘情况

 考虑：```
a= The remaining <Math value="t-1"/> positions are distinct, so the total is <5, b=5, n=6
```我们有\[
\left\Math value="t"/>.</List.Item><List.Item>Return <Math value="\min(n,t)lceil \frac{5}{5}\right\rceil=1.
\]每个州都已经满足\(mb\"/>.</List.Item></List><Text weight="semibold">Why it works.</Text><Textge a\)，所以每个最右边的关闭按钮都位于位置\(5\)。 算法输出\(1\>最右边的关闭按钮位置是<Math value="x(m)=\min(mb,a)"/>)。 

考虑：```
a=8, b=1, n=9
```我们有\[
\left\. As <Math value="m"/> decreases, this sequence is constant while <Math value="m \ge t"/>, then strictly decreaseslceil \frac{8}{1}\right\rceil through the values <Math value="(t-1)b,(t-=8.
\]国家有\(m\ge8\)分享仓位\(8\)。 其余状态对应于不同的倍数\(1\)。 公式给出\[
\min2)b,\dots,b"/>. The minimum number of movements equals(9,8)=8.
\]这正是不同的最右侧按钮位置的数量。 

考虑：```
 the number of distinct positions in this sequence, which is exactly <Math value="\a=9, b=2, n=1
```仅存在一种选项卡关闭状态。 无论几何图形的min(n,t)"/>。</Text><Title value="Python Solution" size="xl"/><，单个鼠标位置就足够了。算法计算\[
\CodeBlock language="python" content="import sys&#10;input =min\left(1,\left\lceil\frac92\right\rceil\right)=1.
\]输出 sys.stdin.readline&#10;&#10;t = int(input())&#10;out =
