---
title: "CF 339D - Xenia 和位操作"
description: "我们从一个长度恰好为 $2^n$ 的数组开始。 最终值是通过重复组合相邻元素产生的。 第一级使用按位或，下一级使用按位异或，然后再次或，然后再次异或，交替进行，直到只剩下一个数字。"
date: "2026-06-06T17:03:04+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "trees"]
categories: ["algorithms"]
codeforces_contest: 339
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 197 (Div. 2)"
rating: 1700
weight: 339
solve_time_s: 135
verified: true
draft: false
---

[CF 339D - Xenia 和位操作](https://codeforces.com/problemset/problem/339/D)

 **评分：** 1700
 **标签：** 数据结构，树
 **求解时间：** 2m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从一个长度恰好为的数组开始$2^n$。 

最终值是通过重复组合相邻元素产生的。 第一级使用按位或，下一级使用按位异或，然后再次或，然后再次异或，交替进行，直到只剩下一个数字。 剩下的数字就是当前数组的答案。 

给出初始数组后，我们会收到更新。 每次更新都会更改一个数组位置，每次更改后我们必须输出新的最终值。 

关键的困难在于数组最多可以包含$2^{17} = 131072$元素，并且可以有多达$10^5$更新。 每次更新后重新计算整个缩减过程将需要每次都触及整个数组。 单次完整重新计算成本$O(2^n)$，大致变成$131072$每个查询的操作。 和$10^5$查询，增长到超过$10^{10}$操作，远远超出了 2 秒的限制。 

还原的结构是固定的。 组合每对元素，然后组合每对结果，依此类推。 唯一改变的是一片叶子的价值。 这强烈暗示了树结构，其中每个内部节点存储其子节点的结果。 

有几个容易被忽视的案例。 

什么时候$n = 1$，树只有一个内部层。 答案很简单：```
a1 OR a2
```始终以 XOR 开头的解决方案将会失败。 

例子：```
1 1
1 2
1 3
```最初：```
1 OR 2 = 3
```更新后：```
3 OR 2 = 3
```输出：```
3
```另一个常见的错误是为每个级别分配了错误的操作。 

例子：```
2 0
1 2 3 4
```1 级：```
1 OR 2 = 3
3 OR 4 = 7
```2 级：```
3 XOR 7 = 4
```回答：```
4
```如果“或”和“异或”的电平互换，结果就会不同。 

更新后出现第三种微妙情况。 只有从修改后的叶子到根的路径上的节点才应该更改。 重建树的不相关部分会浪费时间并且违背了数据结构的目的。 

## 方法

 最直接的解决办法就是准确模拟语句所描述的内容。 

对于每个查询，更新数组元素，重复构建下一级的归约，交替 OR 和 XOR 运算，并继续直到剩下一个值。 这是正确的，因为它确实遵循答案的定义。 

问题是成本。 该数组包含$2^n$元素。 一次完全归约会接触每个元素恒定的次数，因此每次查询都会花费$O(2^n)$。 最坏的情况是：$$10^5 \times 131072$$的操作，这是完全不可行的。 

关键的观察是，归约过程已经形成了完美的二叉树。 

每片叶子对应一个数组元素。 每个内部节点存储其两个子节点的组合结果。 该操作仅取决于节点距叶子的高度。 叶子正上方的节点使用 OR，下一级使用 XOR，然后再次使用 OR，依此类推。 

当一个数组元素发生变化时，只有其根路径上的节点会受到影响。 其他所有子树都保持不变，因为它的叶子没有改变。 

这正是线段树处理的更新模式。 我们在每个节点存储减少值。 点更新修改一个叶子并仅重新计算$O(\log N)$祖先。 根总是包含所需的答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(m·2^n) | O(m·2^n) | O(2^n) | O(2^n) | 太慢了 |
 | 最优线段树| O((2^n) + m log(2^n)) | O((2^n) + m log(2^n)) | O(2^n) | O(2^n) | 已接受 |

 ## 算法演练

 1. 构建一棵线段树，其叶子包含原始数组值。 
2. 对于每个内部节点，确定应在该级别应用哪些操作。 
3. 叶子正上方的节点使用按位 OR，因为问题中的第一个归约步骤使用 OR。 
4. 下一层使用XOR，然后下一层使用OR，一直交替到根。 
5. 在构造过程中，递归地构造左右子值。 
6. 使用分配给当前级别的操作组合子级并将结果存储在节点中。 
7. 更新$(p, b)$，移动到相应的叶子并将其值替换为$b$。 
8. 从递归返回时，使用构造期间使用的相同的依赖于级别的操作重新计算每个祖先。 
9. 更新完成后，根值等于新答案。 输出它。 

### 为什么它有效

 每个内部节点准确地代表原始过程的相应中间归约中出现的值。 最低内部级别存储成对或结果，与第一次迭代匹配。 下一级存储这些值的异或结果，匹配第二次迭代，依此类推。 

不变的是每个节点总是根据交替的 OR/XOR 规则存储其段的正确归约值。 构造为所有节点建立了不变量。 点更新仅更改一个叶子，因此只有其段包含该叶子的节点才会变得无效。 重新计算到根的路径可以恢复不变量。 由于根代表整个数组，因此它的值始终是所需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n, m = map(int, input().split())
    arr = list(map(int, input().split()))

    size = 1 << n
    tree = [0] * (4 * size)

    def build(node, left, right, use_or):
        if left == right:
            tree[node] = arr[left]
            return

        mid = (left + right) // 2

        build(node * 2, left, mid, not use_or)
        build(node * 2 + 1, mid + 1, right, not use_or)

        if use_or:
            tree[node] = tree[node * 2] | tree[node * 2 + 1]
        else:
            tree[node] = tree[node * 2] ^ tree[node * 2 + 1]

    def update(node, left, right, idx, value, use_or):
        if left == right:
            tree[node] = value
            return

        mid = (left + right) // 2

        if idx <= mid:
            update(node * 2, left, mid, idx, value, not use_or)
        else:
            update(node * 2 + 1, mid + 1, right, idx, value, not use_or)

        if use_or:
            tree[node] = tree[node * 2] | tree[node * 2 + 1]
        else:
            tree[node] = tree[node * 2] ^ tree[node * 2 + 1]

    build(1, 0, size - 1, n % 2 == 1)

    answers = []

    for _ in range(m):
        p, b = map(int, input().split())
        update(1, 0, size - 1, p - 1, b, n % 2 == 1)
        answers.append(str(tree[1]))

    sys.stdout.write("\n".join(answers))

if __name__ == "__main__":
    main()
```该树准确地存储了问题描述的缩减值。 参数`use_or`告诉节点哪个操作属于其级别。 

根操作取决于树的高度。 如果`n`是奇数，根用 OR。 如果`n`是偶数，根使用异或。 这直接来自于底层以 OR 开始的交替运算。 

在构造过程中，每个递归调用都会使用以下方法翻转下一级的操作`not use_or`。 当递归到达叶子之上的级别时，运算始终为“或”。 

更新遵循相同的逻辑。 仅访问一条从根到叶的路径，从而给出对数复杂度。 修改叶子后，每个祖先都会使用与构造期间完全相同的操作重新计算。 

不存在溢出问题，因为所有运算都是对小于的值进行按位或和异或$2^{30}$。 

## 工作示例

 ### 示例 1

 输入：```
2 4
1 6 3 5
1 4
3 4
1 2
1 2
```初始树：

 | 细分 | 价值|
 | --- | --- |
 | [1] | 1 |
 | [2] | 6 |
 | [3] | 3 |
 | [4] | 5 |
 | [1,2] = 或 | 7 |
 | [3,4] = 或 | 7 |
 | [1,4] = 异或 | 0 |

 第一次更新后`(1,4)`：

 | 细分 | 价值|
 | --- | --- |
 | [1] | 4 |
 | [2] | 6 |
 | [1,2]| 6 |
 | [3,4]| 7 |
 | 根| 1 |

 输出：```
1
```继续类似的操作会产生：```
1
3
3
3
```此跟踪显示只有更新叶路径上的节点发生变化。 树的大部分都没有受到影响。 

### 示例 2

 输入：```
1 2
1 2
2 0
1 7
```初始树：

 | 水平| 价值|
 | --- | --- |
 | 叶子| 1, 2 |
 | 根（或）| 3 |

 更新后`(2,0)`：

 | 水平| 价值|
 | --- | --- |
 | 叶子| 1, 0 |
 | 根| 1 |

 更新后`(1,7)`：

 | 水平| 价值|
 | --- | --- |
 | 叶子| 7, 0 |
 | 根| 7 |

 输出：```
1
7
```此示例练习尽可能最小的树，并确认所使用的唯一运算是“或”。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(2^n + m·n) | O(2^n + m·n) | 构建一次，每次更新都会涉及一条从根到叶的路径 |
 | 空间| O(2^n) | O(2^n) | 线段树存储 |

 自从$n \le 17$，每次更新最多执行 17 级递归。 即使与$10^5$更新，总工作量仅为约 170 万个节点更新，很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    def solve():
        input = sys.stdin.readline

        n, m = map(int, input().split())
        arr = list(map(int, input().split()))

        size = 1 << n
        tree = [0] * (4 * size)

        def build(node, l, r, use_or):
            if l == r:
                tree[node] = arr[l]
                return

            mid = (l + r) // 2
            build(node * 2, l, mid, not use_or)
            build(node * 2 + 1, mid + 1, r, not use_or)

            if use_or:
                tree[node] = tree[node * 2] | tree[node * 2 + 1]
            else:
                tree[node] = tree[node * 2] ^ tree[node * 2 + 1]

        def update(node, l, r, idx, val, use_or):
            if l == r:
                tree[node] = val
                return

            mid = (l + r) // 2

            if idx <= mid:
                update(node * 2, l, mid, idx, val, not use_or)
            else:
                update(node * 2 + 1, mid + 1, r, idx, val, not use_or)

            if use_or:
                tree[node] = tree[node * 2] | tree[node * 2 + 1]
            else:
                tree[node] = tree[node * 2] ^ tree[node * 2 + 1]

        build(1, 0, size - 1, n % 2 == 1)

        out = []
        for _ in range(m):
            p, b = map(int, input().split())
            update(1, 0, size - 1, p - 1, b, n % 2 == 1)
            out.append(str(tree[1]))

        return "\n".join(out) + ("\n" if out else "")

    return solve()

# provided sample
assert run(
"""2 4
1 6 3 5
1 4
3 4
1 2
1 2
"""
) == """1
3
3
3
"""

# minimum size
assert run(
"""1 1
1 2
1 3
"""
) == """3
"""

# all zeros
assert run(
"""2 1
0 0 0 0
2 5
"""
) == """5
"""

# repeated update of same position
assert run(
"""1 3
7 1
1 7
1 0
1 7
"""
) == """7
1
7
"""

# off-by-one check on last index
assert run(
"""2 1
1 2 4 8
4 0
"""
) == """7
"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`n=1`一次更新 |`3`| 最小的有效树 |
 | 所有零然后更新一片叶子 |`5`| 正确向上传播 |
 | 同一索引上的重复更新 |`7,1,7`| 不再有陈旧的值 |
 | 更新最后位置 |`7`| 右边界索引 |

 ## 边缘情况

 考虑最小的树：```
1 1
1 2
1 3
```内部节点只有一个。 树计算：```
3 OR 2 = 3
```该算法建立一个根`use_or=True`因为`n`很奇怪。 答案正确地报告为`3`。 

考虑根运算为 XOR 的情况：```
2 0
1 2 3 4
```树级别为：```
1 OR 2 = 3
3 OR 4 = 7
3 XOR 7 = 4
```该算法以根开始`use_or=False`因为`n`是均匀的。 递归交替使得下层OR完全匹配所需的序列。 

考虑更新最终数组位置：```
2 1
1 2 4 8
4 0
```更新前：```
(1|2)=3
(4|8)=12
3^12=15
```更新后：```
(1|2)=3
(4|0)=4
3^4=7
```仅重新计算覆盖第四个叶子节点及其祖先的节点。 该算法精确更新该路径并输出`7`，确认边界索引的正确处理。
