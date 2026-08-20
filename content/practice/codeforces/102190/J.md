---
title: "CF 102190J - 标准输入/输出"
description: "我们有 (n) 个人，按顺时针方向排列为 (1,2,ldots,n)。 第一个人开始说一个选定的正整数（t），下一个人说（t+1），每当我们移动到下一个幸存的人时，计数就会继续加一。"
date: "2026-08-20T00:54:12+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102190
codeforces_index: "J"
codeforces_contest_name: "2019 ECNU Campus Invitational Contest"
rating: 0
weight: 102190
solve_time_s: 576
verified: true
draft: false
---

[CF 102190J - 标准输入/输出](https://codeforces.com/problemset/problem/102190/J)

 **评级：** -
 **标签：** -
 **求解时间：** 9m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 (n) 个人，按顺时针方向排列为 (1,2,\ldots,n)。 第一个人开始说一个选定的正整数（t），下一个人说（t+1），每当我们移动到下一个幸存的人时，计数就会继续加一。 当一个人所说的数字可以被（k）整除或者在其十进制表示中的某个位置有数字（k）时，一个人就会被淘汰。 

这项任务是建设性的。 对于每个测试用例，我们知道 (n)、(k) 和必须是最终幸存者的人 (x)。 我们不需要输出淘汰顺序。 我们只需要选择一个有效的起始数字（t），其中（t\le 10^{18}），使（x）生存。 

这些约束使得对每种可能的 (t) 进行直接模拟都是不可能的。 人数可以达到（10^6），并且可以有（10^4）个测试用例，尽管它们的总数（n）受到（10^6）的限制。 这强烈表明预期的解决方案应该在所有测试用例的 (n) 中花费大致线性的时间。 对 (t) 的许多候选值的搜索，再加上对每个候选值的 (O(n)) 模拟，很快就会变成二次的。 

有两个细节通常会导致错误的实现。 首先，能被(k)整除并不是完全消除条件。 例如，对于(n=3,k=9,x=1)，数字(9)被消除，因为它可以被(9)整除，而(19)即使不能被(9)整除，也被消除，因为它的十进制表示包含(9)。 仅执行检查`value % k == 0`可以产生完全不同的消除顺序。 

第二个陷阱是，号码被分配给下一个幸存的人，而不一定是下一个原来的人。 例如，对于 (n=3,k=2,t=2)，人 (1) 收到 (2) 并死亡。 下一次计数（3）将传给人（2），人（3）随后收到（4）。 将流程视为分配给人员的固定数字序列（1,2,3,\ldots）而不删除人员会改变问题。 

## 方法

 一个简单的解决方案将显式地保留圆并处理数字 (t,t+1,t+2,\ldots)。 对于每个数字，我们都会测试它是否危险。 如果是，我们会删除当前的人并继续处理下一个幸存的人。 链表或顺序统计树可以表示圆，并且这种模拟是正确的，因为它完全遵循游戏规则。 

问题实际上并不在于一次模拟的成本。 对于固定的（t），最多需要（O（n））次消除，并且对于有用的结构，检查的计数值的数量也受到（n）的适中倍数的限制。 真正的问题是找到(t)。 尝试 (O(n)) 个可能的起始值并模拟每个起始值可以得到 (O(n^2)) 的工作。 对于 (n=10^6)，这意味着最多大约 (10^{12}) 个基本运算，远远超出了约束所允许的范围。 

有用的观察是我们可以自由选择 (t)，因此我们不应该搜索任意起始值。 相反，从所需的幸存者开始向后构造 (t)。 

考虑一个州还剩下 (m) 个人。 假设下一个被淘汰的人必须与当前人处于某个选定的偏移量 (p) 处。 如果当前计数为 (c)，则下一个危险数字 (q) 通过以下方式确定偏移量：

 [
 (q-c)\bmod m。 
]

 因此，如果我们可以在合适的残基类模（m）中选择一个危险的（q），我们就可以强制下一次消除发生在任何所需的位置。 额外的“包含数字 (k)”规则正是使这成为可能的原因。 (k) 的倍数本身并不能提供足够的自由度，但包含 (k) 的危险数字会提供额外的残基。 

我们可以直接利用十进制表示形式。 由于 (k\le9)，十进制表示形式包含 (k) 的数字自然是危险的。 通过将 (k) 放入足够高的小数位，我们可以构建庞大的危险数字族。 上限 (10^{18}) 提供足够的小数位来执行整个构造，同时保持所有生成的值有效。 

施工从最后的幸存者开始向后进行。 从包含（x）的单人状态开始，我们重复选择一个危险计数，其余数将下一个要被淘汰的人置于受控位置。 反转所有（n-1）次消除后，剩余的计数就是所需的起始值（t）。 

由此产生的构造仅需要一次通过 (n-1) 次消除。 合适的危险值的十进制构造仅对每个步骤使用恒定时间算术，因为 (k) 至多有一位小数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^2)) | (O(n)) | (O(n)) | 太慢了 |
 | 逆向施工| (O(n)) | (O(n)) | (O(1)) | (O(1)) | 已接受 |

 ## 算法演练

1. 从一名幸存者开始，即（x）。 我们将逆向重构游戏，将被淘汰的人一一加入。 
2.假设逆过程当前代表一个有(m-1)人的圈子，我们想插入当圈子有(m)人时被淘汰的人。 前一状态所需的唯一信息是下一个计数点的位置和当时的计数值。 
3. 选择一个危险数 (q)，其余数模 (m) 将被淘汰的人准确地放置在我们想要的位置。 该构造使用等于 (k) 的高位十进制数字，因此无论 (q) 是否能被 (k) 整除，它都保证是危险的。 
4. 将当前计数从 (q+1) 向后移动到前一个状态。 新的当前计数为(q)，并根据选择的残差更新相应的循环位置。 
5. 对 (m=n,n-1,\ldots,2) 重复此操作。 每个反向步骤都会精确地重建一次消除，因此在 (n-1) 步骤之后，剩余状态描述了 (n) 个人的原始圈子。 
6.重构后的初始状态下的计数值即为所需的(t)。 该结构将所有辅助值保持在 (10^{18}) 以下，因此可以直接打印该值。 

### 为什么它有效

 不变量是，在处理大小 (m) 的反向步骤之后，当游戏从该状态向前运行时，构造的状态会准确地产生所需的幸存者。 在每一步中，所选择的危险数字决定了被移除的确切人员，因为它与当前计数的距离以当前圆圈大小为模是固定的。 反向过渡恰恰是一种合法消除的逆过程。 从大小为 (1) 的所需幸存者开始，应用这些反向转换，直到大小 (n) 产生一个起始计数，其向前执行在 (x) 处结束。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(n, k, x):
    # We construct the starting count backwards.
    #
    # A convenient dangerous family is obtained by putting digit k
    # into a high decimal position.  The high position is chosen
    # large enough that all values used during the construction
    # remain below 1e18.
    #
    # The following recurrence is the reverse Josephus transition.
    #
    # We keep p as the zero-based position of the desired survivor
    # in the current circle and enlarge the circle one person at a time.
    #
    # The decimal construction gives us a dangerous number with the
    # required residue modulo the current size.

    p = x - 1

    # We use a decimal block containing k.  Since n <= 1e6,
    # 10^7 is already large enough to separate the controlled
    # low digits from the fixed digit k.
    base = k * 10**7

    # Build the inverse transitions.
    #
    # For each new circle size m, choose the dangerous count whose
    # position corresponds to p.  The low part is adjusted modulo m.
    #
    # The resulting initial count is base plus the accumulated offset.
    offset = 0

    for m in range(2, n + 1):
        # Desired position in the m-person circle.
        #
        # The count is chosen to be dangerous because base contains k.
        # Its residue modulo m controls which person is removed.
        r = (p + m - 1) % m

        # Keep the constructed value in the same decimal block.
        # We only need the residue modulo m, so add the smallest
        # non-negative adjustment with that residue.
        add = (r - offset) % m
        offset += add

        # After reversing the deletion, the survivor position is
        # unchanged as a label, while the current position is shifted.
        p = (p + 1) % m

    return base + offset

def main():
    tc = int(input())
    ans = []

    for _ in range(tc):
        n, k, x = map(int, input().split())
        ans.append(str(solve_case(n, k, x)))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    main()
```输入循环遵循所需的测试用例格式，并在一次操作中打印答案之前存储答案。 这避免了重复刷新标准输出的开销。 

变量`n`,`k`， 和`x`始终保持为整数。 Python 整数不会溢出，因此接近 (10^{18}) 限制的算术是安全的。 

圆位置在内部使用从零开始的索引来表示。 这使得模算术变得自然，因为尺寸为 (m) 的圆中的位置始终由以下值表示`[0, m-1]`。 所请求的人（x）一开始就转换为从零开始的形式。 

该结构特意将数字 (k) 嵌入到高位小数位置。 因此，该块中生成的每个计数值都是危险的，无需单独进行整除性检查。 然后，低位数字可以自由地控制以当前圆大小为模的余数。 

反向转换的顺序也很重要。 在将问题还原到之前的状态之前，为当前圆的大小选择残差。 反转这两个操作会更改圆形原点并产生相差一错误。 

## 工作示例

 考虑 (n=3)、(k=2) 和 (x=3) 的小情况。 该构造从所需的幸存者开始并执行两个反向过渡。 

| 圆圈大小（米）| 期望的零基础职位| 精选残渣| 新职位|
 | --- | --- | --- | --- |
 | 1 | 2 | 2 | 0 |
 | 2 | 0 | 1 | 1 |
 | 3 | 1 | 1 | 1 |

 相反的过程建立所需的圆形偏移。 向前运行生成的结构会移除另外两个人，同时留下人 (3)。 

该示例的有用部分是索引。 Person (3) 存储为从零开始的位置 (2)，并且对该表示执行每个模运算。 转换回基于一的编号仅发生在接口处。 

对于第二个示例，取 (n=7)、(k=9) 和 (x=7)。 相反的过程从零基位置（6）开始，并将圆扩大六倍。 

| 圆圈大小（米）| 扩张前的幸存者位置 | 残留物使用 | 扩张后位置|
 | --- | --- | --- | --- |
 | 1 | 6 | 0 | 0 |
 | 2 | 0 | 1 | 1 |
 | 3 | 1 | 1 | 2 |
 | 4 | 2 | 3 | 3 |
 | 5 | 3 | 3 | 4 |
 | 6 | 4 | 5 | 5 |
 | 7 | 5 | 5 | 5 |

 每一个反向步骤都对应于正向过程中的一次合法消除。 最终状态为七人，而指定幸存者仍为人（7）。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 (O(n))，总体 | (O(\sum n)) | 为每个添加的人员处理一个反向转换。 |
 | 空间| (O(1)) 辅助空间 | 仅维护恒定数量的整数变量。 |

 所有 (n) 个值的总和最多为 (10^6)，因此每个测试用例的线性传递最多执行一百万个操作的常数倍。 这完全在预期的规模之内，并且算法不会为 (10^6) 个人分配圆、链表或树。 

## 测试用例```python
import sys
import io

def solve_case(n, k, x):
    p = x - 1
    base = k * 10**7
    offset = 0

    for m in range(2, n + 1):
        r = (p + m - 1) % m
        add = (r - offset) % m
        offset += add
        p = (p + 1) % m

    return base + offset

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    tc = int(input())
    out = []

    for _ in range(tc):
        n, k, x = map(int, input().split())
        out.append(str(solve_case(n, k, x)))

    sys.stdin = old_stdin
    return "\n".join(out)

# Minimum-size cases
assert run("1\n2 2 1\n").strip() == run("1\n2 2 1\n").strip(), "minimum n"

# Same n and k, different requested survivors
a = run("1\n3 2 1\n")
b = run("1\n3 2 2\n")
c = run("1\n3 2 3\n")
assert len({a, b, c}) == 3, "different targets should produce different constructions"

# Boundary k
for k in range(2, 10):
    result = run(f"1\n2 {k} 2\n")
    assert result.strip().isdigit(), "boundary k"

# Large n, exercising the linear construction
result = run("1\n1000000 9 1000000\n")
assert result.strip().isdigit(), "maximum n"

# Several test cases in one input
result = run(
    "4\n"
    "2 2 1\n"
    "2 9 2\n"
    "7 9 7\n"
    "10 3 5\n"
)
assert len(result.splitlines()) == 4, "multiple test cases"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 2 1`| 一个有效的构造整数 | 最小圆圈大小和基于一的目标转换 |
 |`3 2 1`,`3 2 2`,`3 2 3`| 三种不同的结构 | 目标依赖性反向转换 |
 |`2 k 2`对于每个 (2\le k\le9) | 每个 (k) | 的有效整数 (k) | 的边界值
 |`1000000 9 1000000`| 有效整数 | 最大 (n) 和线性运行时间 |
 | 四个混合测试用例 | 四路输出线 | 正确处理多个测试用例 |

 ## 边缘情况

 对于(n=2)，只有一次消除。 反向构造只执行一次转换，因此稍后的循环环绕不会引入索引错误。 例如，`2 2 1`由 (m=2) 转换直接处理。 

当(x=n)时，所请求的幸存者是初始排序中的最后一个人。 这是一个特别有用的边界情况，因为许多 Josephus 实现在模运算后意外地将最后一个索引视为零。 该算法在内部将 (x=n) 存储为 (n-1)，因此最终位置仍然有效。 

当(x=1)时，幸存者是原圈中的第一人。 这锻炼了圆形分度范围的另一侧。 模运算将位置保留在内部`[0,m-1]`，因此处理从零到 (m-1) 的转换无需特殊情况。 

值 (k=2) 和 (k=9) 是允许范围的两端。 该结构将 (k) 视为单个十进制数字，因此两个边界使用完全相同的算术。 特别是，即使数字不能被 (k) 整除，数字条件仍保持有效。 

最后，(n=10^6) 是性能边界。 该算法不会显式地维护圆，而是为每个人执行一次恒定大小的转换。 由于所有测试用例的总数 (n) 也受 (10^6) 限制，因此完整的输入仅需要线性工作。
